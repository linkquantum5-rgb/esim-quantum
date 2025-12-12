'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';
import { Plus, QrCode, Search, CreditCard, RefreshCw, Printer, CheckCircle, UserSearch, Calendar, Signal, History, Clock, Filter, Trash2, Upload, Image as ImageIcon, Package, Lock, AlertTriangle, Wand2, Mail, Copy, PackageCheck } from 'lucide-react';

import { fetchCountriesList, fetchPlans } from '@/lib/esim-actions';
import { adminPurchaseEsim, getAdminBalance, searchCustomerOrders } from '@/lib/admin-actions';
import { plans as localPlans, countries as localCountries } from '@/lib/data'; 
import AdminLogin from '@/components/AdminLogin';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("pos");
  const [balance, setBalance] = useState(0);
  const MASTER_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"; 

  // POS STATES
  const [apiCountries, setApiCountries] = useState<any[]>([]);
  const [posPlans, setPosPlans] = useState<any[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [planSearch, setPlanSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  // INVENTORY STATES
  const [esims, setEsims] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [uploadTab, setUploadTab] = useState("single"); 
  const [bulkData, setBulkData] = useState("");

  const [invFormData, setInvFormData] = useState({
    countryCode: '', countryName: '', planName: '', price: '', dataAmount: '', duration: '',
    qrImage: '', manualCode: '', stock: '1', smdpAddress: '', activationCode: ''
  });

  // AUTOCOMPLETE
  const [invCountrySearch, setInvCountrySearch] = useState("");
  const [invPlanSearch, setInvPlanSearch] = useState("");
  const [invSelectedCountry, setInvSelectedCountry] = useState("");
  const [invAvailablePlans, setInvAvailablePlans] = useState<any[]>([]);

  // SUPPORT STATES
  const [supportQuery, setSupportQuery] = useState("");
  const [supportResults, setSupportResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterActive, setFilterActive] = useState("");
  const [filterHistory, setFilterHistory] = useState("");

  // ESTADOS PARA FILTROS INDIVIDUALES (SUPPORT)
  const [searchLive, setSearchLive] = useState("");
  const [searchManual, setSearchManual] = useState("");
  const [searchHistoryTabs, setSearchHistoryTabs] = useState(""); 

  useEffect(() => {
    if (isAuthenticated) {
        const init = async () => {
            setBalance(await getAdminBalance());
            setApiCountries(await fetchCountriesList());
            fetchSupabaseOffers(); 
        };
        init();
    }
  }, [isAuthenticated]);

  useEffect(() => {
      if (activeTab === 'support' && supportResults === null) {
          handleSupportSearch(""); 
      }
  }, [activeTab]);

  if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

  // --- HELPER MANUAL ---
  const getManualDetails = (activationString: string) => {
      if (!activationString) return { smdp: 'N/A', code: 'N/A' };
      const parts = activationString.split('$$');
      return parts.length >= 2 ? { smdp: parts[0], code: parts[1] } : { smdp: 'Check QR', code: activationString };
  };

  const handleSendEmail = () => {
      if (!purchaseResult) return;
      const details = getManualDetails(purchaseResult.activation_code);
      const subject = encodeURIComponent(`Your eSIM Details - ${selectedPlan?.name || 'eSIM Quantum'}`);
      const body = encodeURIComponent(`Hello ${customerName},\n\nThank you for your purchase! Here are your eSIM activation details.\n\n🔹 SM-DP+ Address: ${details.smdp}\n🔹 Activation Code: ${details.code}\n\nBest regards,\neSIM Quantum Team`);
      window.open(`mailto:${customerEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  // --- AUTOCOMPLETE ---
  const handleInvCountrySelect = async (countryId: string) => {
      setInvSelectedCountry(countryId);
      const country = apiCountries.find(c => String(c.id) === countryId);
      if (country) {
          const apiPlans = await fetchPlans(countryId);
          const { data: dbPlans } = await supabase.from('offers').select('*').or(`country_name.eq.${country.name},country_code.eq.${country.code}`);
          
          const formattedDbPlans = dbPlans ? dbPlans.map((p: any) => ({ 
              id: p.id, 
              name: `[DB] ${p.plan_name}`, 
              price: p.price, 
              data: p.data_amount + ' GB', 
              type: 'manual',
              manual_code: p.manual_code,
              qr_image: p.qr_image
          })) : [];

          const cleanApiPlans = apiPlans.filter((p:any) => p.type === 'api');
          const uniqueDbPlans = formattedDbPlans.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);

          setInvAvailablePlans([...uniqueDbPlans, ...cleanApiPlans]);
          setInvFormData(prev => ({ ...prev, countryName: country.name, countryCode: country.code }));
      }
  };

  const handleInvPlanSelect = (planId: string) => {
      const plan = invAvailablePlans.find(p => p.id === planId);
      if (plan) {
          const duration = plan.validity ? plan.validity.replace(' Days', '') : '30';
          setInvFormData(prev => ({
              ...prev,
              planName: plan.name.replace('[DB] ', ''), price: String(plan.price),
              dataAmount: plan.data.replace(' GB', '').replace(' Unlimited', 'Unlimited'),
              duration: String(duration),
              qrImage: '', manualCode: '', stock: '1', smdpAddress: '', activationCode: ''
          }));
          toast.success("Template loaded");
      }
  };

  // --- SUPABASE ---
  const fetchSupabaseOffers = async () => {
      setLoadingInventory(true);
      const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
      if (!error && data) setEsims(data);
      setLoadingInventory(false);
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const newOffer = {
          plan_name: invFormData.planName,
          country_name: invFormData.countryName,
          country_code: invFormData.countryCode,
          price: parseFloat(invFormData.price),
          data_amount: invFormData.dataAmount,
          duration: parseInt(invFormData.duration) || 30,
          stock: 1,
          manual_code: `LPA:1$${invFormData.smdpAddress}$${invFormData.activationCode}`,
          qr_image: invFormData.qrImage
      };
      const { error } = await supabase.from('offers').insert([newOffer]);
      if (!error) { toast.success("ESIM Added!"); setDialogOpen(false); fetchSupabaseOffers(); setInvFormData({ countryCode: '', countryName: '', planName: '', price: '', dataAmount: '', duration: '', qrImage: '', smdpAddress: '', activationCode: '', manualCode: '', stock: '1' }); } 
      else { toast.error(error.message); }
  };

  const handleBulkSubmit = async () => {
      if (!bulkData) return toast.error("Paste data first");
      const lines = bulkData.split('\n').filter(line => line.trim() !== "");
      const offersToUpload = lines.map(line => {
          const parts = line.split('|');
          return {
              plan_name: invFormData.planName,
              country_name: invFormData.countryName,
              country_code: invFormData.countryCode,
              price: parseFloat(invFormData.price),
              data_amount: invFormData.dataAmount,
              stock: 1,
              manual_code: parts[0]?.trim(),
              qr_image: parts[1]?.trim() 
          };
      });
      const { error } = await supabase.from('offers').insert(offersToUpload);
      if (!error) { toast.success(`${offersToUpload.length} eSIMs added!`); setDialogOpen(false); fetchSupabaseOffers(); setBulkData(""); } 
      else { toast.error("Error: " + error.message); }
  };

  const confirmDelete = async () => {
      if (deletePassword === MASTER_PASSWORD) {
          const { error } = await supabase.from('offers').delete().eq('id', itemToDelete);
          if (!error) { toast.success("Deleted"); fetchSupabaseOffers(); setDeleteDialogOpen(false); } 
          else { toast.error(error.message); }
      } else { toast.error("Wrong Password!"); }
  };

  // --- HELPERS ---
  const handleImageUpload = (e: any) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => { setInvFormData({ ...invFormData, qrImage: reader.result as string }); };
          reader.readAsDataURL(file);
      }
  };

  const initiateDelete = (id: string) => { setItemToDelete(id); setDeletePassword(""); setDeleteDialogOpen(true); };
  const getDates = (order: any) => { const p = new Date(order.created_at); const e = new Date(p); e.setDate(e.getDate() + 30); return { start: p.toLocaleDateString(), end: e.toLocaleDateString() }; };
  const getConsumed = (order: any) => { if (!order.usage) return "0 GB"; return `${(order.usage.initial_data_quantity - order.usage.rem_data_quantity).toFixed(2)} ${order.usage.initial_data_unit}`; };
  const getProgress = (order: any) => { if(!order.usage || order.usage.initial_data_quantity === 0) return 0; return (order.usage.rem_data_quantity / order.usage.initial_data_quantity) * 100; };
  const getPlanStatus = (order: any) => { if (!order.usage) return "Unknown"; if (order.usage.rem_data_quantity === 0) return "Expired"; if (order.usage.rem_data_quantity === order.usage.initial_data_quantity) return "Pending Activation"; return "Active"; };
  
  // --- HELPER: 30 DAYS CHECK ---
  const isWithin30Days = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
  };

  // --- POS LOGIC ---
  const filteredCountries = apiCountries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  const filteredPlans = posPlans.filter(p => p.name.toLowerCase().includes(planSearch.toLowerCase()));
  const handleApiCountryChange = async (val: string) => { setSelectedCountry(val); setPosPlans([]); setSelectedPlan(null); const p = await fetchPlans(val); setPosPlans(p); };
  const handlePurchase = async () => { if (!selectedPlan || !customerEmail || !customerName) { toast.error("Complete all fields"); return; } setIsProcessing(true); const isManual = selectedPlan.type === 'manual' || selectedPlan.qr_image; const result = await adminPurchaseEsim(selectedPlan.id, customerEmail, customerName, isManual); if (result.success) { toast.success("Sold!"); setPurchaseResult(result); if (!isManual) setBalance(prev => prev - selectedPlan.price); else { fetchSupabaseOffers(); setPosPlans(prev => prev.filter(p => p.id !== selectedPlan.id)); setSelectedPlan(null); } handleSupportSearch(""); } else { toast.error("Failed: " + result.error); } setIsProcessing(false); };
  const resetSale = () => { setPurchaseResult(null); setCustomerEmail(""); setCustomerName(""); setSelectedPlan(null); };

  // --- SUPPORT LOGIC & FILTERS ---
  const handleSupportSearch = async (queryOverride?: string) => { const queryToUse = queryOverride !== undefined ? queryOverride : supportQuery; setIsSearching(true); const res: any = await searchCustomerOrders(queryToUse); if (res.success) { setSupportResults(res.orders); } else { toast.error("Search failed"); } setIsSearching(false); };
  
  const apiLiveOrders = supportResults?.filter((o:any) => {
    const matchesFilter = (o.customer_name || "").toLowerCase().includes(searchLive.toLowerCase()) || (o.customer_email || "").toLowerCase().includes(searchLive.toLowerCase());
    return o.type !== 'manual' && getPlanStatus(o) !== "Expired" && matchesFilter;
  }) || [];

  const manualSoldOrders = supportResults?.filter((o:any) => {
    const matchesFilter = (o.customer_name || "").toLowerCase().includes(searchManual.toLowerCase()) || (o.customer_email || "").toLowerCase().includes(searchManual.toLowerCase());
    return o.type === 'manual' && isWithin30Days(o.created_at) && matchesFilter;
  }) || [];

  const historyOrders = supportResults?.filter((o:any) => {
    const matchesFilter = (o.customer_name || "").toLowerCase().includes(searchHistoryTabs.toLowerCase()) || (o.customer_email || "").toLowerCase().includes(searchHistoryTabs.toLowerCase());
    return ((o.type !== 'manual' && getPlanStatus(o) === "Expired") || (o.type === 'manual' && !isWithin30Days(o.created_at))) && matchesFilter;
  }) || [];

  const invFilteredCountries = apiCountries.filter(c => c.name.toLowerCase().includes(invCountrySearch.toLowerCase()));
  const invFilteredPlans = invAvailablePlans.filter(p => p.name.toLowerCase().includes(invPlanSearch.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div><h1 className="text-4xl font-bold mb-2 text-gray-900">Admin Dashboard</h1><p className="text-gray-600">Management System</p></div>
        <div className="bg-white border px-6 py-3 rounded-xl flex items-center gap-4 shadow-sm"><div className="text-right"><p className="text-xs text-gray-500 font-bold uppercase">Balance</p><p className="text-2xl font-bold text-green-600">${Number(balance).toFixed(2)}</p></div><Button variant="outline" size="icon" onClick={async () => setBalance(await getAdminBalance())}><RefreshCw className="h-4 w-4" /></Button></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]"><TabsTrigger value="pos">🛒 POS</TabsTrigger><TabsTrigger value="inventory">🔥 Offers / Stock</TabsTrigger><TabsTrigger value="support">🔍 Support</TabsTrigger></TabsList>

        {/* POS TAB */}
        <TabsContent value="pos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {!purchaseResult ? (
                    <Card className="border-2 border-blue-50 shadow-md flex flex-col h-full"><CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-blue-600"/> Instant Issue</CardTitle></CardHeader><CardContent className="space-y-5 flex-1"><div className="space-y-2"><Label>1. Destination</Label><div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /><Select onValueChange={handleApiCountryChange}><SelectTrigger className="pl-8"><SelectValue placeholder="Select Country" /></SelectTrigger><SelectContent><div className="p-2 sticky top-0 bg-white z-10"><Input placeholder="Type..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="h-8" onKeyDown={(e) => e.stopPropagation()} /></div>{filteredCountries.map((c:any) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}</SelectContent></Select></div></div><div className="space-y-2"><Label>2. Plan</Label><div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /><Select disabled={!selectedCountry} onValueChange={(id) => setSelectedPlan(posPlans.find(p => p.id === id))}><SelectTrigger className="pl-8"><SelectValue placeholder="Select Plan" /></SelectTrigger><SelectContent><div className="p-2 sticky top-0 bg-white z-10"><Input placeholder="Filter..." value={planSearch} onChange={(e) => setPlanSearch(e.target.value)} className="h-8" onKeyDown={(e) => e.stopPropagation()} /></div>{filteredPlans.map((p:any) => (<SelectItem key={p.id} value={p.id}>{p.data} - ${p.price} ({p.validity})</SelectItem>))}</SelectContent></Select></div></div><div className="space-y-2"><Label>3. Name</Label><Input placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div><div className="space-y-2"><Label>4. Email</Label><Input placeholder="customer@client.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} /></div></CardContent><div className="bg-gray-50 p-6 mt-auto border-t border-gray-100"><div className="flex justify-between items-end mb-4"><span className="text-gray-500 font-medium">Total</span><span className="text-4xl font-bold text-green-600">${selectedPlan ? Number(selectedPlan.price).toFixed(2) : "0.00"}</span></div><Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-xl font-bold shadow-lg" onClick={handlePurchase} disabled={isProcessing || !selectedPlan || !customerEmail || !customerName}>{isProcessing ? "Processing..." : "💰 SELL"}</Button></div></Card>
                ) : (
                    <Card className="border-2 border-green-100 shadow-lg bg-green-50/20 col-span-full"><div className="p-8 text-center space-y-6"><div className="flex flex-col items-center"><CheckCircle className="h-16 w-16 text-green-600 mb-2" /><h2 className="text-3xl font-bold text-green-800">Sale Completed!</h2><p className="text-gray-600">eSIM issued for {customerName}</p></div><div className="grid md:grid-cols-2 gap-8 text-left bg-white p-6 rounded-xl border border-gray-200"><div className="flex flex-col items-center justify-center border-r border-gray-100 pr-4"><Label className="mb-2 text-gray-500">Scan QR Code</Label><img src={purchaseResult.qr_code} alt="QR" className="w-48 h-48 border p-2 rounded-lg" /></div><div className="space-y-4"><Label className="text-gray-500">Manual Activation Details</Label><div className="space-y-1"><p className="text-xs font-bold text-gray-400 uppercase">SM-DP+ Address</p><div className="flex gap-2"><code className="bg-gray-100 p-2 rounded block w-full text-sm">{getManualDetails(purchaseResult.activation_code).smdp}</code><Button size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(getManualDetails(purchaseResult.activation_code).smdp)}><Copy className="h-4 w-4"/></Button></div></div><div className="space-y-1"><p className="text-xs font-bold text-gray-400 uppercase">Activation Code</p><div className="flex gap-2"><code className="bg-gray-100 p-2 rounded block w-full text-sm">{getManualDetails(purchaseResult.activation_code).code}</code><Button size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(getManualDetails(purchaseResult.activation_code).code)}><Copy className="h-4 w-4"/></Button></div></div></div></div><div className="flex gap-4 justify-center pt-4"><Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print Page</Button><Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendEmail}><Mail className="mr-2 h-4 w-4"/> Send Email to Customer</Button><Button variant="ghost" onClick={resetSale}>New Sale</Button></div></div></Card>
                )}
                {!purchaseResult && (<Card className="bg-gray-50 border-dashed border-2 h-full flex flex-col justify-center min-h-[400px]"><div className="text-center text-gray-400"><QrCode className="h-24 w-24 mx-auto mb-4 opacity-20" /><p>QR Code & Details will appear here.</p></div></Card>)}
            </div>
        </TabsContent>

        {/* INVENTORY TAB */}
        <TabsContent value="inventory">
            <div className="mb-8 flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-orange-600">Special Offers</h2><p className="text-gray-600">Manage offers.</p></div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild><Button size="lg" className="bg-orange-600 hover:bg-orange-700"><Plus className="h-5 w-5 mr-2" /> Add Offer</Button></DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Create Offer</DialogTitle><DialogDescription>Auto-fill from API or DB.</DialogDescription></DialogHeader>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100"><div className="flex items-center gap-2 mb-2 text-blue-700 text-sm font-bold"><Wand2 className="h-4 w-4"/> Autofill Template</div><div className="grid grid-cols-2 gap-4"><Select onValueChange={handleInvCountrySelect}><SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger><SelectContent><div className="p-2 sticky top-0 bg-white z-10"><Input placeholder="Filter..." value={invCountrySearch} onChange={(e) => setInvCountrySearch(e.target.value)} className="h-8" onKeyDown={(e) => e.stopPropagation()} /></div>{invFilteredCountries.map((c:any) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}</SelectContent></Select><Select disabled={!invSelectedCountry} onValueChange={handleInvPlanSelect}><SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger><SelectContent><div className="p-2 sticky top-0 bg-white z-10"><Input placeholder="Filter..." value={invPlanSearch} onChange={(e) => setInvPlanSearch(e.target.value)} className="h-8" onKeyDown={(e) => e.stopPropagation()} /></div>{invFilteredPlans.map((p:any) => (<SelectItem key={p.id} value={p.id}>{p.data} - ${p.price}</SelectItem>))}</SelectContent></Select></div></div>
                        <Tabs value={uploadTab} onValueChange={setUploadTab}>
                            <TabsList className="w-full mb-4"><TabsTrigger value="single" className="flex-1">Single Upload</TabsTrigger><TabsTrigger value="bulk" className="flex-1">Bulk Upload (Text)</TabsTrigger></TabsList>
                            <TabsContent value="single">
                                <form onSubmit={handleInventorySubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Country Name</Label><Input placeholder="Bahamas" value={invFormData.countryName} onChange={(e) => setInvFormData({...invFormData, countryName: e.target.value})} /></div><div className="space-y-2"><Label>Plan Name</Label><Input placeholder="10GB Promo" value={invFormData.planName} onChange={(e) => setInvFormData({...invFormData, planName: e.target.value})} /></div></div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2"><Label>Data (GB)</Label><Input placeholder="10 GB" value={invFormData.dataAmount} onChange={(e) => setInvFormData({...invFormData, dataAmount: e.target.value})} /></div>
                                        <div className="space-y-2"><Label>Duration (Days)</Label><Input type="number" placeholder="30" value={invFormData.duration} onChange={(e) => setInvFormData({...invFormData, duration: e.target.value})} /></div>
                                        <div className="space-y-2"><Label>Price ($)</Label><Input type="number" placeholder="15.00" value={invFormData.price} onChange={(e) => setInvFormData({...invFormData, price: e.target.value})} /></div>
                                    </div>
                                    <div className="space-y-2"><Label>Stock (Always 1)</Label><Input type="number" value={1} disabled className="bg-gray-100" /></div>
                                    <div className="space-y-2"><Label>QR Image</Label><div className="flex items-center gap-2"><Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer" />{invFormData.qrImage && <CheckCircle className="text-green-500 h-6 w-6"/>}</div></div>
                                    <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>SM-DP+ Address</Label><Input placeholder="rsp.truphone.com" value={invFormData.smdpAddress} onChange={(e) => setInvFormData({...invFormData, smdpAddress: e.target.value})} /></div><div className="space-y-2"><Label>Activation Code</Label><Input placeholder="AC-123..." value={invFormData.activationCode} onChange={(e) => setInvFormData({...invFormData, activationCode: e.target.value})} /></div></div>
                                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Save Unique eSIM</Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="bulk">
                                <div className="space-y-4"><div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">Format: <strong>SMDP | CODE | IMAGE_URL</strong> (One per line)</div><Textarea placeholder="rsp.truphone.com | ABC... | https://imgur.com/qr1.png" className="w-full h-32 border rounded p-2 font-mono text-xs" value={bulkData} onChange={(e) => setBulkData(e.target.value)} /><Button onClick={handleBulkSubmit} className="w-full bg-orange-600">Process Bulk Upload</Button></div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>
            <Card><CardContent className="p-0">{esims.length === 0 ? <div className="text-center py-12 text-gray-400"><Package className="h-12 w-12 mx-auto mb-2 opacity-20"/>No offers in database.</div> : (
                <Table><TableHeader><TableRow><TableHead>Plan</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>QR</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{esims.map((e) => (<TableRow key={e.id}><TableCell><div className="font-bold">{e.plan_name}</div><div className="text-xs text-gray-500">{e.country_name}</div></TableCell><TableCell className="font-bold text-green-600">${e.price}</TableCell><TableCell><Badge variant="outline">1 Unique</Badge></TableCell><TableCell>{e.qr_image ? <ImageIcon className="h-4 w-4 text-blue-500"/> : <span className="text-xs text-gray-300">-</span>}</TableCell><TableCell><Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => initiateDelete(e.id)}><Trash2 className="h-4 w-4"/></Button></TableCell></TableRow>))}</TableBody></Table>
            )}</CardContent></Card>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5"/> Security Check</DialogTitle><DialogDescription>Enter master password to delete from DB.</DialogDescription></DialogHeader><Input type="password" placeholder="Master Password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} /><DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete Permanently</Button></DialogFooter></DialogContent></Dialog>
        </TabsContent>

        {/* SUPPORT TAB */}
        <TabsContent value="support">
            <div className="grid gap-8">
                <Card className="bg-blue-50 border-blue-100"><CardContent className="pt-6 flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input placeholder="GLOBAL SEARCH: Client Name, Email or ICCID (Press Enter)" className="pl-9 bg-white" value={supportQuery} onChange={(e) => setSupportQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSupportSearch()} /></div><Button onClick={() => handleSupportSearch()} disabled={isSearching}>{isSearching ? "..." : "Search"}</Button></CardContent></Card>
                
                {/* LISTA 1: LIVE API */}
                <Card>
                    <CardHeader><div className="flex items-center justify-between"><div><CardTitle className="flex items-center gap-2 text-green-700"><Signal className="h-5 w-5" /> Live Plans (API)</CardTitle><CardDescription>Currently Active or Pending.</CardDescription></div></div></CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">
                                    Customer
                                    <Input placeholder="Search name..." className="h-6 text-xs mt-1 font-normal" value={searchLive} onChange={(e) => setSearchLive(e.target.value)} onClick={(e) => e.stopPropagation()} />
                                </TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {apiLiveOrders.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No live API plans found.</TableCell></TableRow>
                        ) : (
                            apiLiveOrders.map((order: any, idx: number) => { const status = getPlanStatus(order); return (<TableRow key={idx} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedOrder(order)}><TableCell><div className="font-medium">{order.customer_name || order.name || order.customer_email}</div><div className="text-xs text-gray-500 font-mono">{order.iccid}</div></TableCell><TableCell>{order.bundle || order.package}</TableCell><TableCell><Badge className={status === "Pending Activation" ? "bg-yellow-500" : "bg-green-500"}>{status}</Badge></TableCell><TableCell><Button variant="ghost" size="sm">Details</Button></TableCell></TableRow>); })
                        )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>

                {/* LISTA 2: SOLD MANUAL */}
                <Card className="border-orange-200 bg-orange-50/20">
                    <CardHeader><div className="flex items-center justify-between"><div><CardTitle className="flex items-center gap-2 text-orange-700"><PackageCheck className="h-5 w-5" /> Sold Offers (Manual)</CardTitle><CardDescription>Recently sold physical eSIMs (30 Days).</CardDescription></div></div></CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">
                                    Customer
                                    <Input placeholder="Search name..." className="h-6 text-xs mt-1 font-normal bg-white" value={searchManual} onChange={(e) => setSearchManual(e.target.value)} onClick={(e) => e.stopPropagation()} />
                                </TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {manualSoldOrders.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No recent manual sales.</TableCell></TableRow>
                        ) : (
                            manualSoldOrders.map((order: any, idx: number) => (<TableRow key={idx} className="cursor-pointer hover:bg-white" onClick={() => setSelectedOrder(order)}><TableCell><div className="font-medium">{order.customer_name}</div><div className="text-xs text-gray-500">{order.customer_email}</div></TableCell><TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell><TableCell>{order.bundle}</TableCell><TableCell><Button variant="ghost" size="sm">Details</Button></TableCell></TableRow>))
                        )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>

                {/* LISTA 3: HISTORY */}
                <Card>
                    <CardHeader><div className="flex items-center justify-between"><div><CardTitle className="flex items-center gap-2 text-gray-500"><History className="h-5 w-5" /> History / Expired</CardTitle></div></div></CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">
                                    Customer
                                    <Input placeholder="Search name..." className="h-6 text-xs mt-1 font-normal" value={searchHistoryTabs} onChange={(e) => setSearchHistoryTabs(e.target.value)} onClick={(e) => e.stopPropagation()} />
                                </TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {historyOrders.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No history.</TableCell></TableRow>
                        ) : (
                            historyOrders.map((order: any, idx: number) => (<TableRow key={idx} className="cursor-pointer hover:bg-gray-50 opacity-70" onClick={() => setSelectedOrder(order)}><TableCell>{order.customer_email}</TableCell><TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell><TableCell>{order.bundle || order.package}</TableCell><TableCell><Button variant="ghost" size="sm">Details</Button></TableCell></TableRow>))
                        )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </div>
            
            {/* MODAL DE DETALLES */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Details</DialogTitle></DialogHeader>{selectedOrder && (<div className="space-y-6"><div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"><div><p className="text-sm text-gray-500">Customer</p><p className="font-bold">{selectedOrder.customer_name || "Guest"}</p><p className="text-xs text-gray-400">{selectedOrder.customer_email}</p></div><div className="text-right"><p className="text-sm text-gray-500">Order ID</p><p className="font-mono text-xs font-bold">{selectedOrder.iccid}</p></div></div><div className="grid grid-cols-2 gap-4"><div className="bg-blue-50 p-3 rounded-lg border border-blue-100"><p className="text-xs text-blue-600 font-bold uppercase flex items-center gap-1"><Clock className="h-3 w-3"/> Expired On</p><p className="font-mono font-medium">{getDates(selectedOrder).end}</p></div><div className="bg-orange-50 p-3 rounded-lg border border-orange-100"><p className="text-xs text-orange-600 font-bold uppercase flex items-center gap-1"><Signal className="h-3 w-3"/> Consumed</p><p className="font-mono font-medium">{getConsumed(selectedOrder)}</p></div></div><div className="space-y-2"><div className="flex justify-between text-sm"><span className="font-medium">Data Remaining</span><span className="font-bold">{selectedOrder.usage?.rem_data_quantity} {selectedOrder.usage?.rem_data_unit}</span></div><Progress value={getProgress(selectedOrder)} className="h-2" /><p className="text-xs text-right text-gray-400">Total: {selectedOrder.usage?.initial_data_quantity} {selectedOrder.usage?.initial_data_unit}</p></div>
            {selectedOrder.type === 'manual' && (
                <div className="bg-gray-100 p-3 rounded border">
                    <p className="text-xs font-bold text-gray-500 mb-1">MANUAL CODES (SUPPORT ONLY)</p>
                    <div className="text-xs font-mono break-all space-y-1">
                        <p>SM-DP+: {getManualDetails(selectedOrder.manual_code).smdp}</p>
                        <p>Code: {getManualDetails(selectedOrder.manual_code).code}</p>
                    </div>
                </div>
            )}
            <DialogFooter><Button className="w-full" onClick={() => window.open(selectedOrder.qrcode_url, '_blank')}><QrCode className="mr-2 h-4 w-4"/> Re-send QR</Button></DialogFooter></div>)}</DialogContent></Dialog>
        </TabsContent>

      </Tabs>
    </div>
  );
}
