import { Rocket, Globe, Shield, Map, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600 rounded-full blur-[100px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <span className="text-orange-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            About Us
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            The future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              limitless connectivity
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            We are travelers, engineers, and dreamers building a world where digital borders disappear.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-20">
        
        {/* --- OUR PHILOSOPHY --- */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Quantum Leap in Connectivity</h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                At <strong>eSIM Quantum</strong>, we believe the most advanced technology is the one that feels invisible.
              </p>
              <p>
                We were born from the frustration of abusive roaming fees and the desperate search for WiFi in unknown airports. We knew there had to be a better way.
              </p>
              <p>
                We don&apos;t just sell data; we sell <strong>freedom</strong>. The ability to land in Tokyo, New York, or Paris and be connected before picking up your luggage.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-lg">
             <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg"><Rocket className="text-orange-600 h-6 w-6"/></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Instant Activation</h4>
                    <p className="text-gray-500">No shipping. No plastic. Your connection arrives in your email in seconds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><Globe className="text-blue-600 h-6 w-6"/></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Global Coverage</h4>
                    <p className="text-gray-500">Partnerships with the best local carriers in over 200 countries.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg"><Shield className="text-green-600 h-6 w-6"/></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Total Security</h4>
                    <p className="text-gray-500">Private and encrypted connection. Much safer than public WiFi.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- MISSION --- */}
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
           <div className="relative z-10 max-w-3xl mx-auto">
             <Map className="h-12 w-12 text-orange-500 mx-auto mb-6" />
             <h3 className="text-3xl font-bold mb-6">One World, One Flag</h3>
             <p className="text-lg text-slate-300 mb-8 leading-relaxed">
               Our mission is to empower global travelers by fostering a world where movement is frictionless. 
               Everything we do is designed to be clear, easy to use, and 100% transparent.
             </p>
             <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
               <HeartHandshake className="text-orange-400 h-5 w-5" />
               <span className="font-medium text-orange-50">Committed to your journey</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
