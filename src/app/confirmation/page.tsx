'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';
import QRCode from 'qrcode';
import { Order, PhysicalESIM } from '@/lib/types';

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const orderData = sessionStorage.getItem('order');
    if (!orderData) {
      router.push('/');
      return;
    }

    const parsedOrder = JSON.parse(orderData);
    setOrder(parsedOrder);

    // Generate QR codes
    if (parsedOrder.assignedESIMs) {
      parsedOrder.assignedESIMs.forEach(async (esim: PhysicalESIM) => {
        if (esim.qrCodeType === 'text') {
          const url = await QRCode.toDataURL(esim.qrCode);
          setQrCodes((prev) => ({ ...prev, [esim.id]: url }));
        }
      });
    }
  }, [router]);

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">
            Purchase Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Your eSIM(s) are ready to use
          </p>
          <p className="text-gray-600 mt-2">
            Order ID: <span className="font-mono font-semibold">{order.id}</span>
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer Name</p>
                <p className="font-semibold">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Country</p>
                <p className="font-semibold">{order.customer.country}</p>
              </div>
              <div>
                <p className="text-gray-600">Device Type</p>
                <p className="font-semibold">{order.customer.deviceType}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-orange-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your eSIM QR Codes</h2>

          {order.assignedESIMs?.map((esim: PhysicalESIM, idx: number) => {
            const item = order.items[idx];
            return (
              <Card key={esim.id}>
                <CardHeader>
                  <CardTitle>{item?.plan?.name || 'eSIM Plan'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Scan this QR Code</h3>
                      {qrCodes[esim.id] ? (
                        <div className="bg-white p-4 rounded-lg border inline-block">
                          <img src={qrCodes[esim.id]} alt="eSIM QR Code" className="w-64 h-64" />
                        </div>
                      ) : (
                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          Generating QR Code...
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Activation Code</h3>
                      <div className="bg-gray-50 p-4 rounded-lg break-all font-mono text-sm mb-4">
                        {esim.qrCode}
                      </div>
                      <h3 className="font-semibold mb-2">How to Install:</h3>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        <li>Go to Settings on your device</li>
                        <li>Tap on Cellular/Mobile Data</li>
                        <li>Select "Add eSIM"</li>
                        <li>Scan the QR code above or enter the code manually</li>
                        <li>Follow the on-screen instructions</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Check Your Email</h3>
              <p className="text-gray-600">
                We've sent all the QR codes and activation instructions to{' '}
                <span className="font-semibold">{order.customer.email}</span>.
                Please check your inbox (and spam folder).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/plans">
            <Button variant="outline" size="lg">
              Buy More Plans
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
