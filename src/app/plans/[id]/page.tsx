'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
// IMPORTANTE: Agregamos fetchCountriesList para buscar la bandera correcta
import { fetchPlanById, fetchCountriesList } from '@/lib/esim-actions';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingCart, Database, Calendar, Zap, Wifi, Info, ShieldCheck } from 'lucide-react';

export default function PlanDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const planId = params.id as string;
  const countryId = searchParams.get('cid') || undefined; 

  const [plan, setPlan] = useState<any | null>(null);
  
  // Estados para la apariencia visual (Bandera y Nombre)
  const [displayFlag, setDisplayFlag] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadPlan = async () => {
      setLoading(true);
      try {
          // 1. Buscamos el plan
          const data = await fetchPlanById(planId, countryId);
          
          if (data) {
              setPlan(data);
              
              // 2. LÓGICA VISUAL: Determinar qué bandera mostrar
              // Si hay un ID de país específico en la URL (cid), buscamos su bandera real
              if (countryId && countryId !== 'all' && countryId !== 'undefined') {
                  const countries = await fetchCountriesList();
                  const specificCountry = countries.find((c: any) => String(c.id) === String(countryId));
                  
                  if (specificCountry) {
                      // Usamos la info del país seleccionado
                      setDisplayFlag(specificCountry.flag);
                      setDisplayName(specificCountry.name);
                  } else {
                      // Fallback: Usamos la info del plan
                      setDisplayFlag(data.flag);
                      setDisplayName(data.countryObj.name);
                  }
              } else {
                  // Si no hay filtro de país, usamos la info original del plan
                  setDisplayFlag(data.flag);
                  setDisplayName(data.countryObj.name);
              }
          }
      } catch (error) {
          console.error("Error loading plan:", error);
      } finally {
          setLoading(false);
      }
    };
    loadPlan();
  }, [planId, countryId]);

  const handleAddToCart = () => {
    if (plan) {
      // Al añadir al carrito, guardamos la info visual correcta
      const planToAdd = {
          ...plan,
          // Opcional: si quieres que en el carrito también salga la bandera del país específico
          // flag: displayFlag, 
          // name: `${plan.name} (${displayName})`
      };
      addItem(planToAdd);
      toast.success('Added to cart!');
    }
  };

  const handleImageError = (e: any) => { e.target.src = 'https://flagcdn.com/w80/un.png'; };

  if (loading) return (<div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>);

  if (!plan) return (
    <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
        <p className="text-gray-600 mb-6">We couldn't retrieve the details. Please try again.</p>
        <Link href="/plans"><Button>Browse all plans</Button></Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link href="/plans">
        <Button variant="ghost" className="mb-6 hover:text-orange-600 pl-0"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans</Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
                 {/* USAMOS LA BANDERA FORZADA (displayFlag) */}
                 <img src={displayFlag || plan.flag} onError={handleImageError} alt="flag" className="w-16 h-10 object-cover rounded border border-gray-200 shadow-sm"/>
                 <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{plan.name}</h1>
                    {/* USAMOS EL NOMBRE FORZADO (displayName) */}
                    <p className="text-gray-500">{displayName || plan.countryObj.name}</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3"><div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Database className="h-5 w-5" /></div><span className="font-medium text-gray-700">Data</span></div>
                    <span className="font-bold text-gray-900">{plan.data}</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Calendar className="h-5 w-5" /></div><span className="font-medium text-gray-700">Validity</span></div>
                    <span className="font-bold text-gray-900">{plan.validity}</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3"><div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Zap className="h-5 w-5" /></div><span className="font-medium text-gray-700">Speed Limit</span></div>
                    <div className="flex items-center gap-1"><span className="font-bold text-gray-900">{plan.speed || '4G/5G'}</span><Info className="h-4 w-4 text-gray-400" /></div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3"><div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Wifi className="h-5 w-5" /></div><span className="font-medium text-gray-700">Tethering</span></div>
                    <span className="font-bold text-gray-900">{plan.tethering || 'Yes'}</span>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Supported Countries & Networks</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    {plan.networks && plan.networks.length > 0 ? (
                        plan.networks.map((net: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                <span className="font-medium text-gray-800">{net.name}</span>
                                <div className="flex items-center gap-2"><span className="text-gray-600 text-sm">{net.operator}</span><span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full font-bold">4G/5G</span></div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{displayName || plan.countryObj.name}</span>
                            <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full font-bold">Best Available Network</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-5 text-sm text-teal-900">
                <ul className="list-disc list-inside space-y-2">
                    <li>eSim will be activated when first byte of data is consumed.</li>
                    <li>Data limits reset every 24 hours from first use for daily plans.</li>
                    <li><strong>Note:</strong> eSIM purchases are not eligible for a refund after 60 days.</li>
                </ul>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="mb-6">
                    <span className="text-gray-500 font-medium">Total Price</span>
                    <div className="flex items-baseline gap-1"><span className="text-5xl font-bold text-orange-600">${Number(plan.price).toFixed(2)}</span><span className="text-gray-400">USD</span></div>
                </div>
                
                <div className="space-y-4 mb-8 text-sm">
                    <div className="flex justify-between border-b pb-2"><span>Data</span><span className="font-bold">{plan.data}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Validity</span><span className="font-bold">{plan.validity}</span></div>
                    <div className="flex justify-between"><span>Activation</span><span className="font-bold text-green-600 flex items-center gap-1"><ShieldCheck className="h-3 w-3"/> Instant</span></div>
                </div>

                <div className="space-y-3">
                    <Button onClick={handleAddToCart} className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700"><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</Button>
                    <Link href="/cart"><Button variant="outline" className="w-full h-12 text-lg">Go to Checkout</Button></Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
