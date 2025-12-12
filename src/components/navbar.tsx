'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X } from 'lucide-react'; // Importamos iconos de menú
import { useState } from 'react'; // Importamos estado para abrir/cerrar

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Estado para controlar si el menú móvil está abierto
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lista de enlaces para no repetir código
  const navLinks = [
    { name: 'Plans', href: '/plans' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Check Status', href: '/track', special: true },
    { name: 'Benefits', href: '/benefits' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl">
            LR
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            eSIM Quantum
          </span>
        </Link>

        {/* 2. MENÚ DE ESCRITORIO (Visible solo en PC 'hidden md:flex') */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium hover:text-orange-600 transition-colors ${link.special ? 'text-orange-700' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* 3. DERECHA: CARRITO Y BOTÓN MENÚ MÓVIL */}
        <div className="flex items-center space-x-4">
          
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

          {/* Botón Hamburguesa (Visible solo en Móvil 'md:hidden') */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </div>

      {/* 4. CAJA DEL MENÚ MÓVIL (Se despliega abajo) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-5">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // Cierra al hacer clic
                className={`block py-3 px-4 rounded-lg text-base font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors ${link.special ? 'text-orange-700' : 'text-gray-700'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
