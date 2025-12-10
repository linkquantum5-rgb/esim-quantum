'use server';

import { supabase } from '@/lib/supabase';

const API_URL = process.env.ESIM_API_URL || "https://portal.esimcard.com/api/developer/reseller";
const EMAIL = process.env.ESIM_USER_EMAIL;
const PASSWORD = process.env.ESIM_USER_PASSWORD;

// CONFIGURACIÓN
const PORCENTAJE_GANANCIA = 50; 
const PRECIO_MINIMO = 0; 
const PRECIO_MAXIMO = 9999;
const PAISES_BLOQUEADOS: string[] = []; 
const PLANES_BLOQUEADOS_ID: string[] = [
    '890bdffa-94a5-4b1e-ae21-875d125c378d',
    'd9748bff-5dba-4791-b10f-408ab377f05d',
    'f943b5a5-a9d7-4ceb-b95c-90a1f5d31cec',
    'efbea2d9-a918-4daa-a1a3-9cb23fd83f41',
    '21e99b75-cca0-475b-a150-807ec3707311',
    '475fe010-d51e-432a-b62d-a713f42f695a',
    '0319f6c3-cf41-4001-8551-98459782e1bd',
    'e3bb73dc-5746-4e0c-bc6a-87b9e750056c',
    'e3bb73dc-5746-4e0c-bc6a-87b9e750056c',
    '40e034ff-fe20-4dd6-8595-ba818fd20448',
    '135e4f6d-7df7-4c78-aa46-b697a4b974e4',
    'dd021cf1-d58e-4ac9-aa51-999277f42070',  
    'c8bf01ab-c1b2-4994-80e3-2866b43fc60a',
'71563a56-298e-497b-99a7-54d13553883e',
'246b15d5-2ef9-421e-97f6-705cd6d9f1ba',
'642e0a3b-bac1-49a3-ae45-cc6f773d5659',
'e65786d8-c120-4f87-a1e5-95ba27a361b3',
'a562254b-fe0a-4b03-bd72-eab9cb8a9866',
'904ac999-9a60-48e3-8e83-b63b0c028a08',
'4a90ef7e-d6b9-4f2b-ad24-d5c4d5a7cf2a',
]; 

// --- HELPERS ---

async function getAuthToken() {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status ? data.access_token : null;
  } catch (error) { return null; }
}

function getFlagUrl(code: string | null | undefined) {
  if (!code) return 'https://flagcdn.com/w80/un.png';
  let c = code.toString().toLowerCase().trim();
  if (c === 'gl' || c.length > 3) return 'https://flagcdn.com/w80/un.png';
  if (c === 'uk') c = 'gb';
  return `https://flagcdn.com/w80/${c}.png`;
}

function detectCountryFromTitle(planName: string, currentCode: string): string {
    const name = planName.toLowerCase();
    if (name.includes('bahamas')) return 'bs';
    if (name.includes('taiwan')) return 'tw';
    if (name.includes('usa') || name.includes('united states')) return 'us';
    return currentCode;
}

// MAPEO DB -> WEB
function mapSupabaseToPlan(offer: any, totalStockInGroup: number = 1) {
    const durationText = offer.duration ? `${offer.duration} Days` : '30 Days';

    return {
        id: offer.id, 
        name: offer.plan_name,
        price: Number(offer.price),
        data: `${offer.data_amount} GB`,
        validity: durationText, 
        speed: '4G/5G Premium',
        tethering: 'Yes',
        features: [
            'Physical Stock', 
            'Instant QR', 
            'Premium Network',
            `Stock Available: ${totalStockInGroup}` 
        ],
        type: 'manual', 
        countryCode: offer.country_code?.toLowerCase() || 'gl',
        flag: getFlagUrl(offer.country_code),
        countryObj: { 
            id: 'manual', 
            code: offer.country_code, 
            name: offer.country_name, 
            flag: getFlagUrl(offer.country_code) 
        },
        qr_image: offer.qr_image
    };
}

// MAPEO API -> WEB
function mapApiDataToPlan(pkg: any) {
  const safeCountries = Array.isArray(pkg.countries) ? pkg.countries : [];
  const mainCountry = safeCountries.length > 0 ? safeCountries[0] : null;
  let countryCode = 'GL';
  if (mainCountry) countryCode = mainCountry.iso || mainCountry.iso_code || mainCountry.code || 'GL';
  
  countryCode = detectCountryFromTitle(pkg.name, countryCode);
  const flagUrl = getFlagUrl(countryCode);
  
  const costoOriginal = Number(pkg.price);
  const precioVenta = costoOriginal * (1 + (PORCENTAJE_GANANCIA / 100));
  const isUnlimited = pkg.data_quantity === -1 || pkg.data_quantity > 100; 
  const dataDisplay = isUnlimited ? '∞ Unlimited' : `${pkg.data_quantity} ${pkg.data_unit}`;

  const networks = safeCountries.map((c: any) => ({
      name: c.name,
      operator: c.networks && c.networks.length > 0 ? c.networks[0].name : 'Best Available Network',
      type: '4G/5G LTE'
  }));

  return {
    id: pkg.id,
    name: pkg.name,
    price: Number(precioVenta.toFixed(2)),
    data: dataDisplay,
    validity: `${pkg.package_validity} ${pkg.package_validity_unit}`,
    speed: '4G/5G LTE',
    tethering: 'Yes',
    features: ['Data Only', 'Instant Activation'],
    type: 'api',
    countryCode: countryCode,
    flag: flagUrl,
    coverage: safeCountries.map((c: any) => c.name),
    networks: networks,
    countryObj: { id: mainCountry?.id, code: countryCode, name: mainCountry ? mainCountry.name : 'Global', flag: flagUrl }
  };
}

// --- FUNCIONES PÚBLICAS ---

export async function fetchCountriesList() {
  const token = await getAuthToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/packages/country`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, next: { revalidate: 86400 } });
    const json = await res.json();
    if (!json.status || !json.data) return [];
    return json.data.map((c: any) => ({ id: c.id, code: c.iso || c.code || 'GL', name: c.name, flag: getFlagUrl(c.iso || c.code) })).sort((a:any, b:any) => a.name.localeCompare(b.name));
  } catch (error) { return []; }
}

export async function fetchPlans(countryId?: number | string) {
  let combinedPlans: any[] = [];

  // 1. OBTENER MANUALES (DB)
  try {
      const { data: manualData } = await supabase.from('offers').select('*');
      if (manualData && manualData.length > 0) {
          const groupedOffers: { [key: string]: any[] } = {};
          manualData.forEach(offer => {
              const key = `${offer.plan_name}-${offer.country_code}`;
              if (!groupedOffers[key]) groupedOffers[key] = [];
              groupedOffers[key].push(offer);
          });
          const consolidatedPlans = Object.values(groupedOffers).map(group => mapSupabaseToPlan(group[0], group.length));
          combinedPlans = [...consolidatedPlans];
      }
  } catch (e) { console.error("Error DB", e); }

  // 2. OBTENER API
  const token = await getAuthToken();
  if (token) {
      try {
        if (!countryId || countryId === 'all' || countryId === 'undefined') {
            for (let i = 1; i <= 3; i++) {
                const res = await fetch(`${API_URL}/packages?package_type=DATA-ONLY&page=${i}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
                const json = await res.json();
                if (json.status && json.data) {
                    combinedPlans.push(...json.data.map(mapApiDataToPlan));
                } else { break; }
            }
        } else {
            const res = await fetch(`${API_URL}/packages/country/${countryId}?package_type=DATA-ONLY`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
            const json = await res.json();
            if (json.status && json.data) {
                combinedPlans.push(...json.data.map(mapApiDataToPlan));
            }
        }
      } catch (e) { console.error("Error API", e); }
  }

  return combinedPlans.filter((p:any) => !PLANES_BLOQUEADOS_ID.includes(p.id));
}

// --- FUNCIÓN MEJORADA: fetchPlanById ---
export async function fetchPlanById(id: string, searchCountryId?: string) {
  // 1. INTENTO EN BASE DE DATOS (Supabase)
  try {
      // Si el ID parece un UUID (largo con guiones), buscamos en DB primero
      if(id.includes('-') && id.length > 20) {
        const { data } = await supabase.from('offers').select('*').eq('id', id).single();
        if (data) return mapSupabaseToPlan(data, 1);
      }
  } catch (e) {}

  // 2. TOKEN API
  const token = await getAuthToken();
  if (!token) return null;

  // 3. INTENTO DIRECTO A LA API
  try {
    const res = await fetch(`${API_URL}/package/details/${id}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
    if (res.ok) {
        const json = await res.json();
        if(json.status && json.data) return mapApiDataToPlan(json.data);
    }
  } catch (e) {}

  // 4. INTENTO POR PAÍS ESPECÍFICO (NUEVO Y POTENTE)
  // Si tenemos el ID del país (cid), buscamos dentro de la lista de ese país.
  // A veces la API no devuelve el detalle directo pero sí aparece en la lista del país.
  if (searchCountryId && searchCountryId !== 'all' && searchCountryId !== 'undefined') {
      try {
          const res = await fetch(`${API_URL}/packages/country/${searchCountryId}?package_type=DATA-ONLY`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
          const json = await res.json();
          if (json.status && json.data) {
              const found = json.data.find((p: any) => String(p.id) === String(id));
              if (found) return mapApiDataToPlan(found);
          }
      } catch (e) {}
  }

  // 5. BÚSQUEDA DE RESCATE (GLOBAL)
  // Si todo lo anterior falla, buscamos en las primeras páginas globales
  try {
      for (let i = 1; i <= 5; i++) {
          const res = await fetch(`${API_URL}/packages?package_type=DATA-ONLY&page=${i}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, next: { revalidate: 60 } });
          const json = await res.json();
          if (json.status && json.data) {
              const found = json.data.find((p: any) => String(p.id) === String(id));
              if (found) return mapApiDataToPlan(found);
          }
      }
  } catch (e) {}

  return null;
}
