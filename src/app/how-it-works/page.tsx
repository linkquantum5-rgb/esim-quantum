import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Mail, Smartphone, Globe } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: ShoppingCart,
      title: 'Choose Your Plan',
      description: 'Browse our extensive collection of eSIM plans and select the one that fits your destination and data needs.',
    },
    {
      icon: Mail,
      title: 'Complete Purchase',
      description: 'Enter your details and complete the secure checkout. You\'ll receive your eSIM QR code via email instantly.',
    },
    {
      icon: Smartphone,
      title: 'Scan & Install',
      description: 'Simply scan the QR code with your device camera or enter the activation code manually in your device settings.',
    },
    {
      icon: Globe,
      title: 'Stay Connected',
      description: 'Activate your eSIM and enjoy high-speed internet wherever you go. No physical SIM card swapping required!',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            How It Works
          </h1>
          <p className="text-xl text-gray-600">
            Get connected in 4 simple steps
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <Card key={idx} className="border-2 hover:border-orange-500 transition-all">
              <CardContent className="pt-6">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="h-8 w-8 text-orange-600" />
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 bg-orange-50 rounded-lg border border-orange-200">
          <h2 className="text-2xl font-bold mb-4">Device Compatibility</h2>
          <p className="text-gray-600 mb-4">
            Most modern smartphones and tablets support eSIM technology. Compatible devices include:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
            <li>• iPhone XS and newer</li>
            <li>• Samsung Galaxy S20 and newer</li>
            <li>• Google Pixel 3 and newer</li>
            <li>• iPad Pro (2018) and newer</li>
            <li>• Huawei P40 and newer</li>
            <li>• Many other devices</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Check your device settings to confirm eSIM compatibility before purchasing.
          </p>
        </div>
      </div>
    </div>
  );
}
