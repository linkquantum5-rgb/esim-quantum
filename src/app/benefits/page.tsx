import { Card, CardContent } from '@/components/ui/card';
import {
  DollarSign,
  Zap,
  Shield,
  Globe,
  Clock,
  Leaf,
  Smartphone,
  HeadphonesIcon
} from 'lucide-react';

export default function BenefitsPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Cost-Effective',
      description: 'Save money on international roaming charges with our competitive pricing. No hidden fees or surprise bills.',
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Get connected immediately after purchase. No waiting for physical SIM cards to arrive in the mail.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Stay connected in over 200 countries worldwide with our extensive network partnerships.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Purchase and activate eSIMs anytime, anywhere. Our service is always available when you need it.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Reduce plastic waste by eliminating the need for physical SIM cards and packaging.',
    },
    {
      icon: Smartphone,
      title: 'Multi-Device Support',
      description: 'Use eSIMs across multiple compatible devices without the hassle of swapping physical cards.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Expert Support',
      description: 'Our dedicated support team is available 24/7 to help you with any questions or issues.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Benefits of eSIM Quantum
          </h1>
          <p className="text-xl text-gray-600">
            Experience the future of mobile connectivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {benefits.map((benefit, idx) => (
            <Card key={idx} className="border-2 hover:border-orange-500 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-orange-100 flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose eSIM Over Traditional SIM?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="opacity-90">Countries Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="opacity-90">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
