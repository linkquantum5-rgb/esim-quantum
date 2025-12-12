'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Plans', href: '/plans' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Check Status', href: '/track', color: 'text-orange-600' },
    { name: 'Benefits', href: '/benefits' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-orange-600 text-white font-bold rounded-lg p-1.5 text-xl">LR</div>
          <span className="text-xl font-bold text-orange-600" translate="no">eSIM Quantum</span>
        </Link>

        {/* MENU PC */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium hover:text-orange-600 transition-colors ${link.color || 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ICONOS */}
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-orange-600">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* HAMBURGUESA MÓVIL */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* DESPLEGABLE MÓVIL (Sin botón Admin) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl z-40 animate-in slide-in-from-top-5">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium py-2 border-b border-gray-100 last:border-0 hover:text-orange-600 ${link.color || 'text-gray-700'}`}
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
