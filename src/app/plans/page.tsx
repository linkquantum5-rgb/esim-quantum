'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Check, ShoppingCart, Search, ChevronDown, Star } from 'lucide-react';
import { fetchCountriesList, fetchPlans } from '@/lib/esim-actions';

// AQUÍ PUEDES PEGAR LOS IDs QUE QUIERAS OCULTAR
const PLANES_OCULTOS_IDS = ['4507a01c-47fc-4c54-9c43-dfc8f9e10404'];

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [allFetchedPlans, setAllFetchedPlans] = useState<any[]>([]); 
  const [countries, setCountries] = useState<any[]>([]);
  
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedCountryName, setSelectedCountryName] = useState<string>('Loading...');
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string>('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const addItem = useCartStore((state) => state.addItem);

  const handleImageError = (e: any) => {
    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/64px-Flag_of_the_United_Nations.svg.png";
    e.currentTarget.onerror = null; 
  };

  // --- FILTRADO ---
  const filterPlansByCountry = (list: any[], countryId: string, countryList: any[]) => {
    if (!countryId || countryId === 'all') return list;
    
    const targetCountry = countryList.find(c => String(c.id) === String(countryId));
    if (!targetCountry) return list;

    const targetCode = targetCountry.code.toLowerCase();
    const targetName = targetCountry.name.toLowerCase();

    return list.filter(p => {
        const codeMatch = p.countryCode && p.countryCode.toLowerCase() === targetCode;
        const nameMatch = p.name.toLowerCase().includes(targetName);
        return codeMatch || nameMatch;
    });
  };

  // --- INICIO ---
  useEffect(() => {
    const init = async () => {
      try {
        const countriesData = await fetchCountriesList();
        setCountries(countriesData);

        const bahamas = countriesData.find((c: any) => c.code.toUpperCase() === 'BS');

        if (bahamas) {
            setSelectedCountryId(String(bahamas.id));
            setSelectedCountryName(bahamas.name);
            setSelectedCountryFlag(bahamas.flag);

            const rawBahamasPlans = await fetchPlans(bahamas.id);
            const strictlyBahamas = filterPlansByCountry(rawBahamasPlans, String(bahamas.id), countriesData);

            if (strictlyBahamas.length > 0) {
                setPlans(strictlyBahamas);
                fetchPlans('all').then(p => setAllFetchedPlans(p));
            } else {
                const allPlans = await fetchPlans('all');
                setAllFetchedPlans(allPlans);
                handleSelectCountry('all', 'All Plans', 'https://flagcdn.com/w80/un.png', allPlans, countriesData);
            }
        } else {
            const allPlans = await fetchPlans('all');
            setAllFetchedPlans(allPlans);
            handleSelectCountry('all', 'All Plans', 'https://flagcdn.com/w80/un.png', allPlans, countriesData);
        }

      } catch (error) { toast.error("Connection error"); } finally { setLoading(false); }
    };
    init();

    function handleClickOutside(event: any) { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsDropdownOpen(false); } }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectCountry = async (id: string, name: string, flagUrl: string, preloadedPlans?: any[], preloadedCountries?: any[]) => {
    setSelectedCountryId(id);
    setSelectedCountryName(name);
    setSelectedCountryFlag(flagUrl);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    const currentCountriesList = preloadedCountries || countries;

    if (id !== 'all' && !preloadedPlans) {
        setLoadingPlans(true);
        const freshPlans = await fetchPlans(id); 
        const filteredFreshPlans = filterPlansByCountry(freshPlans, id, currentCountriesList);
        setPlans(filteredFreshPlans);
        setLoadingPlans(false);
    } else {
        const baseList = preloadedPlans || allFetchedPlans;
        setPlans(filterPlansByCountry(baseList, id, currentCountriesList));
    }
  };

  const handleReset = async () => { handleSelectCountry('all', 'All Plans', 'https://flagcdn.com/w80/un.png'); };
  const handleAddToCart = (plan: any) => { addItem(plan); toast.success('Added to cart!'); };

  const planesVisibles = plans.filter(p => !PLANES_OCULTOS_IDS.includes(p.id));

  if (loading) return (<div className="container mx-auto px-4 py-20 text-center"><div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div></div>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Choose Your eSIM Plan
        </h1>
        <p className="text-xl text-gray-600">Global coverage with instant activation.</p>
      </div>

      <div className="mb-8 max-w-md mx-auto relative" ref={dropdownRef}>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-orange-500 transition-all">
            <div className="flex items-center gap-3"><img src={selectedCountryFlag} onError={handleImageError} alt="Flag" className="w-8 h-5 object-cover rounded shadow-sm border border-gray-200"/><span className="text-gray-700 text-lg truncate">{selectedCountryName}</span></div><ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isDropdownOpen && (<div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 flex flex-col"><div className="p-2 border-b border-gray-100 sticky top-0 bg-white"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus /></div></div><div className="overflow-y-auto flex-1 p-1 custom-scrollbar"><button onClick={() => handleReset()} className="w-full text-left px-4 py-2 hover:bg-orange-50 rounded-md flex items-center gap-3 text-gray-700"><img src="https://flagcdn.com/w80/un.png" className="w-6 h-4 object-cover rounded" alt="Global" /><span>All Plans</span></button>{filteredCountries.map((country) => (<button key={country.id} onClick={() => handleSelectCountry(String(country.id), country.name, country.flag)} className="w-full text-left px-4 py-2 hover:bg-orange-50 rounded-md flex items-center gap-3 text-gray-700 border-b border-gray-50 last:border-0"><img src={country.flag} onError={handleImageError} alt={country.name} className="w-8 h-5 object-cover rounded shadow-sm border border-gray-100"/><span className="font-medium">{country.name}</span></button>))}</div></div>)}
      </div>

      {loadingPlans ? <div className="py-20 text-center text-gray-500">Searching...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planesVisibles.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-600 text-lg mb-4">No plans available for {selectedCountryName}.</p>
                    <Button variant="link" onClick={handleReset}>Show All Plans</Button>
                </div>
            ) : planesVisibles.map((plan) => {
                
                const isManual = plan.type === 'manual';
                let cidParam = 'all';
                let cardFlag = plan.flag;

                if (selectedCountryId && selectedCountryId !== 'all') {
                    cidParam = selectedCountryId;
                    if (!isManual) cardFlag = selectedCountryFlag;
                } else {
                    cidParam = plan.countryObj?.id || 'all';
                }

                return (
                <Card key={plan.id} className={`flex flex-col shadow-lg transition-all ${isManual ? 'border-2 border-yellow-400 bg-yellow-50/30' : 'border hover:border-orange-500'}`}>
                    <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <div className="relative w-12 h-8">
                            <img src={cardFlag} onError={handleImageError} alt="Flag" className="w-full h-full object-cover rounded shadow-sm border border-gray-100" />
                        </div>
                        {isManual ? <Badge className="bg-yellow-500 text-black"><Star className="h-3 w-3 mr-1 fill-current"/> Special Offer</Badge> : <Badge variant="secondary">Instant eSIM</Badge>}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{Array.isArray(plan.coverage) ? plan.coverage.join(', ') : 'Global Coverage'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                    <div className="space-y-4">
                        <div><div className="text-3xl font-bold text-orange-600">${Number(plan.price).toFixed(2)}</div><div className="text-sm text-gray-500 font-medium">{plan.data} • {plan.validity}</div></div>
                        <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-start gap-2"><Check className="h-5 w-5 text-green-600 mt-0.5" /><span className="text-sm">{plan.speed}</span></div>
                        {Array.isArray(plan.features) && plan.features.map((feature: string, idx: number) => (<div key={idx} className="flex items-start gap-2"><Check className="h-5 w-5 text-green-600 mt-0.5" /><span className="text-sm">{feature}</span></div>))}
                        </div>
                    </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                    <Link href={`/plans/${plan.id}?cid=${cidParam}`} className="flex-1"><Button variant="outline" className="w-full hover:bg-orange-50">View Details</Button></Link>
                    <Button onClick={() => handleAddToCart(plan)} className="flex-1 bg-orange-600 hover:bg-orange-700"><ShoppingCart className="h-4 w-4 mr-2" /> Add</Button>
                    </CardFooter>
                </Card>
                );
            })}
        </div>
      )}
    </div>
  );
}
