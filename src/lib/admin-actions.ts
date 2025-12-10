'use server';

import { supabase } from '@/lib/supabase';

const API_URL = process.env.ESIM_API_URL || "https://portal.esimcard.com/api/developer/reseller";
const EMAIL = process.env.ESIM_USER_EMAIL;
const PASSWORD = process.env.ESIM_USER_PASSWORD;

// --- AUTH ---
async function getAuthToken() {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status ? data.access_token : null;
  } catch (error) { return null; }
}

// --- 1. COMPRA (GUARDA HISTORIAL) ---
export async function adminPurchaseEsim(planId: string, customerEmail: string, customerName: string, isManualOffer: boolean = false) {
  
  // === CASO A: VENTA MANUAL (OFERTA) ===
  if (isManualOffer) {
      // 1. Obtener datos antes de borrar
      const { data: offer } = await supabase.from('offers').select('*').eq('id', planId).single();
      
      if (!offer) return { success: false, error: "Offer sold out or not found" };

      // 2. GUARDAR EN HISTORIAL DE VENTAS (NUEVO)
      const saleRecord = {
          customer_name: customerName,
          customer_email: customerEmail,
          plan_name: offer.plan_name,
          price: offer.price,
          manual_code: offer.manual_code, // Contiene SMDP$$Code
          qr_image: offer.qr_image,
          iccid: `MANUAL-${Math.floor(Math.random() * 1000000)}`, // ID Generado
          status: 'Sold'
      };
      await supabase.from('sales_history').insert([saleRecord]);

      // 3. Restar Stock / Borrar de Ofertas
      if (offer.stock <= 1) {
          await supabase.from('offers').delete().eq('id', planId);
      } else {
          await supabase.from('offers').update({ stock: offer.stock - 1 }).eq('id', planId);
      }

      // 4. Formatear respuesta
      let activationCode = offer.manual_code || "Manual Activation";
      if (activationCode.includes('$$')) {
          const parts = activationCode.split('$$');
          activationCode = `SM-DP+: ${parts[0]}\nCode: ${parts[1]}`;
      }

      return {
          success: true,
          qr_code: offer.qr_image, 
          activation_code: activationCode,
          is_manual: true
      };
  }

  // === CASO B: VENTA API ===
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Auth Error" };

  try {
    const res = await fetch(`${API_URL}/package/purchase`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ package_type_id: planId, email: customerEmail, name: customerName, count: 1 }),
    });
    const json = await res.json();
    
    if (json.status || json.success) {
      return { 
        success: true, 
        qr_code: json.data?.sim?.qrcode_url, 
        activation_code: json.data?.sim?.activation_code
      };
    }
    return { success: false, error: json.message || "API Error" };
  } catch (error) { return { success: false, error: "Connection Error" }; }
}

export async function getAdminBalance() {
  const token = await getAuthToken();
  if (!token) return 0;
  try {
    const res = await fetch(`${API_URL}/balance`, { headers: { 'Authorization': `Bearer ${token}` }, next: { revalidate: 60 } });
    const json = await res.json();
    return json.balance || 0;
  } catch (e) { return 0; }
}

// --- 3. BUSCADOR HÍBRIDO (API + SUPABASE) ---
export async function searchCustomerOrders(query: string) {
  const token = await getAuthToken();
  let allOrders: any[] = [];

  // A. BUSCAR EN SUPABASE (VENTAS FÍSICAS)
  try {
      // Si hay query, filtramos. Si no, traemos todo.
      let queryBuilder = supabase.from('sales_history').select('*').order('created_at', { ascending: false });
      
      if (query && query.trim() !== "") {
          // Filtro simple en Supabase
          queryBuilder = queryBuilder.or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%,iccid.ilike.%${query}%`);
      } else {
          queryBuilder = queryBuilder.limit(20); // Si no busca nada, traer últimos 20
      }

      const { data: manualSales } = await queryBuilder;

      if (manualSales) {
          // Adaptamos al formato unificado
          const mappedManual = manualSales.map((s: any) => ({
              id: s.id,
              created_at: s.created_at,
              customer_name: s.customer_name,
              customer_email: s.customer_email,
              bundle: s.plan_name, // Unificamos nombre
              iccid: s.iccid,
              qrcode_url: s.qr_image,
              manual_code: s.manual_code, // Campo extra para soporte manual
              usage: { rem_data_quantity: 'Physical', rem_data_unit: 'Sim', initial_data_quantity: 'N/A', initial_data_unit: '' }, // Fake usage
              type: 'manual'
          }));
          allOrders = [...allOrders, ...mappedManual];
      }
  } catch (e) { console.error("Error DB Search", e); }

  // B. BUSCAR EN API (VENTAS AUTOMÁTICAS)
  if (token) {
      try {
        const res = await fetch(`${API_URL}/my-esims`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' });
        const json = await res.json();
        
        if (json.status && json.data) {
            let apiSales = json.data;
            
            if (query && query.trim() !== "") {
                const term = query.toLowerCase().trim();
                apiSales = apiSales.filter((sale: any) => {
                    return (sale.customer_email?.toLowerCase().includes(term) || 
                            sale.iccid?.includes(term) || 
                            sale.name?.toLowerCase().includes(term) || 
                            sale.customer_name?.toLowerCase().includes(term));
                });
            }

            // Obtener uso de datos solo para API
            const apiOrdersWithUsage = await Promise.all(apiSales.slice(0, 20).map(async (sale: any) => {
                try {
                    const usageRes = await fetch(`${API_URL}/my-sim/${sale.iccid}/usage`, { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' });
                    const usageJson = await usageRes.json();
                    return { ...sale, usage: usageJson.data || null, type: 'api' };
                } catch (e) { return { ...sale, type: 'api' }; }
            }));

            allOrders = [...allOrders, ...apiOrdersWithUsage];
        }
      } catch (e) { console.error("Error API Search", e); }
  }

  // Ordenar todo por fecha (Más reciente primero)
  allOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return { success: true, orders: allOrders };
}
