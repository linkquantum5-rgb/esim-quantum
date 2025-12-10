import { RefreshCcw, Smartphone, WifiOff, CheckCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600 rounded-full blur-[100px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Refund Policy</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Change of plans? No problem! Buy your eSIM Quantum with peace of mind.
          </p>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-4 max-w-5xl py-16">
        
        {/* INTRO */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Types of Refunds</h2>
          <p className="text-gray-600">
            We understand that travel plans can change or technology can fail. Here is how we protect your purchase.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Change of Plans */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <RefreshCcw className="text-orange-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Service Withdrawal</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If your travel plans have changed and you no longer need your eSIM Quantum, we will provide a <strong>full refund</strong> provided the eSIM has not been installed or used.
            </p>
          </div>

          {/* Card 2: Incompatible Device */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="text-blue-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Incompatible Device</h3>
            <p className="text-gray-600 text-sm mb-4">
              We refund if your phone is locked or incompatible, provided you meet these conditions:
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/> QR Code not scanned
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/> No data usage
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/> Purchased within 6 months
              </li>
            </ul>
          </div>

          {/* Card 3: Connection Issues */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <WifiOff className="text-red-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connection Issues</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If your eSIM does not work due to a technical issue with eSIM Quantum or the local network infrastructure, we can offer a <strong>full or partial refund</strong>.
            </p>
          </div>
        </div>

        {/* PROCESS SECTION */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h3>
            <p className="text-gray-600 mb-4">
              Leave it all in our hands! Simply contact our Customer Support Team providing the necessary information (screenshots or order ID).
            </p>
            <div className="flex items-center gap-2 font-medium text-gray-900 bg-white inline-block px-4 py-2 rounded-lg border border-gray-200">
              <Mail className="h-5 w-5 text-orange-600" />
              LR@esimquantum.com
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Your money will be refunded to the original payment method within <strong>5 to 10 business days</strong>.
            </p>
          </div>
          
          <div className="shrink-0">
             <Link href="/plans">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-200">
                Ready to take off?
                <ArrowRight className="h-5 w-5" />
              </button>
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
