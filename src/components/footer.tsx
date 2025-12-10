import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* SECCIÓN 1: LOGO Y TEXTO (Sin cambios) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl">
                LR
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                eSIM Quantum
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Global eSIM connectivity at your fingertips. Stay connected wherever you go.
            </p>
          </div>

          {/* SECCIÓN 2: PRODUCTOS (Sin cambios) */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/plans" className="text-gray-600 hover:text-orange-600 transition-colors">
                  eSIM Plans
                </Link>
              </li>
              <li>
                <Link href="/plans?region=europe" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Europe Plans
                </Link>
              </li>
              <li>
                <Link href="/plans?region=asia" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Asia Plans
                </Link>
              </li>
              <li>
                <Link href="/plans?region=americas" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Americas Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* SECCIÓN 3: SOPORTE (Sin cambios) */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-orange-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* SECCIÓN 4: COMPANY (AQUÍ ESTÁN TODOS LOS CAMBIOS) */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              
              {/* 1. About Us (Enlace corregido) */}
              <li>
                <Link href="/about" className="text-gray-600 hover:text-orange-600 transition-colors">
                  About Us
                </Link>
              </li>

              {/* 2. Privacy Policy (Enlace corregido) */}
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>

              {/* 3. Refund Policy (NUEVO - Agregado aquí) */}
              <li>
                <Link href="/refund-policy" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Refund Policy
                </Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} eSIM Quantum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
