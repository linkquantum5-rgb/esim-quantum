'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ShoppingCart, Clock } from 'lucide-react';

export default function OffersPage() {
  // AQUÍ SIMULAMOS LOS DATOS QUE CREASTE EN EL ADMIN
  // (En una app real, esto vendría de la base de datos)
  const offers = [
    { id: 1, country: "Bahamas", plan: "10 GB Promo", price: 15.00, stock: 3, total: 10, flag: "🇧🇸" },
    { id: 2, country: "USA", plan: "Unlimited Flash", price: 25.00, stock: 1, total: 5, flag: "🇺🇸" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge className="bg-red-500 text-white px-4 py-1 text-lg mb-4 animate-pulse">🔥 Limited Time Offers</Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Flash Sales</h1>
        <p className="text-xl text-gray-600">Get premium physical inventory eSIMs before they run out.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <Card key={offer.id} className="border-2 border-orange-100 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 w-full"></div>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <span className="text-5xl">{offer.flag}</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Ends soon
                    </Badge>
                </div>
                <CardTitle className="text-2xl mt-2">{offer.plan}</CardTitle>
                <p className="text-gray-500 font-medium">{offer.country}</p>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-sm text-gray-400 line-through">${(offer.price * 1.5).toFixed(2)}</p>
                        <p className="text-4xl font-bold text-green-600">${offer.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-red-500">Hurry up!</p>
                        <p className="text-xs text-gray-500">Only {offer.stock} left</p>
                    </div>
                </div>
                
                {/* BARRA DE STOCK */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(offer.stock / offer.total) * 100}%` }}></div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg">
                    <ShoppingCart className="mr-2 h-5 w-5"/> Buy Now
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
