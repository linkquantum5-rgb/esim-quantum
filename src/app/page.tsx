'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Zap, Shield, HeadphonesIcon, Smartphone, Wifi } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Stay Connected Worldwide
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience seamless global connectivity with eSIM Quantum.
            Instant activation, no physical SIM cards, 200+ countries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plans">
              <Button size="lg" className="text-lg px-8 py-6">
                Browse Plans
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                How it Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose eSIM Quantum?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-orange-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-orange-100">
                    <Globe className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Global Coverage</h3>
                  <p className="text-gray-600">
                    Connect in over 200 countries with our extensive network partnerships
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-orange-100">
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Instant Activation</h3>
                  <p className="text-gray-600">
                    Get connected in seconds with our instant digital activation
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-orange-100">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Secure & Reliable</h3>
                  <p className="text-gray-600">
                    Enterprise-grade security with 99.9% uptime guarantee
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-orange-100">
                    <HeadphonesIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">24/7 Support</h3>
                  <p className="text-gray-600">
                    Our dedicated team is always here to help you stay connected
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-orange-100">
                    <Smartphone className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Easy Setup</h3>
                  <p className="text-gray-600">
                    Simple scan and connect - no technical knowledge required
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-orange-100">
                    <Wifi className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">High-Speed Data</h3>
                  <p className="text-gray-600">
                    Enjoy 4G/5G speeds wherever available in your destination
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your destination and find the perfect plan
          </p>
          <Link href="/plans">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              View All Plans
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
