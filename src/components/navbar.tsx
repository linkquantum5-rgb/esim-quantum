'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl">
            LR
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            eSIM Quantum
          </span>
        </Link>

        {/* MENÚ DE NAVEGACIÓN (CENTRO) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/plans" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Plans
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:text-orange-600 transition-colors">
            How it Works
          </Link>
          
          {/* RASTREO DE PEDIDOS (Visible para clientes) */}
          <Link href="/track" className="text-sm font-medium hover:text-orange-600 transition-colors text-orange-700">
            Check Status
          </Link>

          <Link href="/benefits" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Benefits
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-orange-600 transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Contact
          </Link>
        </div>

        {/* BOTONES DERECHA (SOLO CARRITO) */}
        <div className="flex items-center space-x-4">
          {/* El botón de Admin ha sido eliminado de aquí por seguridad */}
          
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-500 text-xs text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
