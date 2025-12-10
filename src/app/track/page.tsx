'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Search, QrCode, Signal, AlertCircle } from 'lucide-react';
// Importación corregida para evitar errores
import { searchCustomerOrders } from '@/lib/admin-actions';

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
        toast.error("Please enter your Email or ICCID");
        return;
    }

    setLoading(true);
    try {
        // Llamada a la función del servidor
        // Usamos 'any' para evitar errores de tipado estrictos
        const res: any = await searchCustomerOrders(query);
        
        if (res.success && res.orders && res.orders.length > 0) {
            setOrders(res.orders);
            toast.success(`Found ${res.orders.length} active plan(s)`);
        } else {
            setOrders([]);
            toast.error("No active plans found with this information.");
        }
    } catch (error) {
        toast.error("Connection error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your eSIM Status</h1>
        <p className="text-gray-600 text-lg">
          Enter your <strong>Email Address</strong> or <strong>ICCID</strong> to retrieve your QR code and check real-time data usage.
        </p>
      </div>

      {/* FORMULARIO DE BÚSQUEDA */}
      <Card className="mb-8 border-2 border-blue-50 shadow-lg">
        <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                        placeholder="Ex: client@gmail.com or 89000..." 
                        className="pl-10 h-12 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" className="h-12 text-lg bg-blue-600 hover:bg-blue-700 w-full" disabled={loading}>
                    {loading ? "Searching Network..." : "Track My eSIM"}
                </Button>
            </form>
        </CardContent>
      </Card>

      {/* LISTA DE RESULTADOS */}
      <div className="space-y-6">
        {/* Mensaje si no hay resultados */}
        {orders !== null && orders.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">No plans found.</p>
                <p className="text-sm text-gray-400">Make sure you are using the email you used for purchase.</p>
            </div>
        )}

        {/* Tarjetas de eSIM encontradas */}
        {orders && orders.map((order: any, idx: number) => (
            <Card key={idx} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                    <span className="font-bold text-gray-700 truncate max-w-[200px]">
                        {order.bundle || order.package || "eSIM Plan"}
                    </span>
                    {/* Estado del plan (Activo/Expirado) */}
                    <Badge variant={order.usage?.rem_data_quantity > 0 ? "default" : "secondary"}>
                        {order.usage?.rem_data_quantity > 0 ? "Active" : "Expired / Empty"}
                    </Badge>
                </div>
                
                <CardContent className="p-6 grid gap-6">
                    {/* USO DE DATOS (DATA USAGE) */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                                <Signal className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Data Remaining</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {order.usage ? `${order.usage.rem_data_quantity} ${order.usage.rem_data_unit}` : "Unknown"}
                                </p>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500">Total Limit</p>
                            <p className="font-medium">
                                {order.usage ? `${order.usage.initial_data_quantity} ${order.usage.initial_data_unit}` : "-"}
                            </p>
                        </div>
                    </div>

                    {/* INFORMACIÓN TÉCNICA */}
                    <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                        <div>
                            <span className="block text-gray-500 mb-1">ICCID (Serial)</span>
                            <span className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                {order.iccid}
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-500 mb-1">Purchase Date</span>
                            <span className="font-medium text-gray-800">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* BOTÓN PARA VER EL QR */}
                    <div className="pt-2 flex justify-end">
                        <Button 
                            onClick={() => window.open(order.qrcode_url, '_blank')} 
                            variant="outline" 
                            className="w-full sm:w-auto hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                        >
                            <QrCode className="mr-2 h-4 w-4" /> 
                            View & Scan QR Code
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

    </div>
  );
}
