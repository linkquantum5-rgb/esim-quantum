'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is an eSIM?',
      answer: 'An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card. It\'s built into your device and can be programmed remotely.',
    },
    {
      question: 'How do I know if my device supports eSIM?',
      answer: 'Most modern smartphones released after 2018 support eSIM, including iPhone XS and newer, Samsung Galaxy S20 and newer, Google Pixel 3 and newer, and many others. Check your device settings under Cellular/Mobile Data to see if you have the option to add an eSIM.',
    },
    {
      question: 'How long does it take to receive my eSIM?',
      answer: 'For digital eSIMs, you\'ll receive your QR code via email within minutes of purchase. Physical eSIM QR codes are also delivered instantly after payment confirmation.',
    },
    {
      question: 'Can I use multiple eSIMs on one device?',
      answer: 'Yes! Most eSIM-compatible devices can store multiple eSIM profiles and switch between them easily. However, typically only one eSIM can be active at a time, though some devices support dual active SIMs.',
    },
    {
      question: 'What happens if I lose my QR code?',
      answer: 'Don\'t worry! You can always access your QR code by checking your email or contacting our support team. We keep a record of all your purchases.',
    },
    {
      question: 'Can I top up my data?',
      answer: 'Yes, most of our plans support unlimited top-ups. You can purchase additional data packages anytime through our website.',
    },
    {
      question: 'Do I need to remove my physical SIM card?',
      answer: 'No, you can keep your physical SIM card in your device. Most modern phones support dual SIM functionality, allowing you to use both your regular SIM and eSIM simultaneously.',
    },
    {
      question: 'What if my eSIM doesn\'t work?',
      answer: 'Our support team is available 24/7 to help you troubleshoot any issues. Common solutions include checking your device compatibility, ensuring you have a stable internet connection during activation, and verifying the QR code is scanned correctly.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No, the price you see is the price you pay. There are no activation fees, hidden charges, or surprise bills. All costs are transparent upfront.',
    },
    {
      question: 'How do I activate my eSIM?',
      answer: 'Simply scan the QR code we send you with your device camera, or manually enter the activation code in your device settings. Detailed instructions are provided with your purchase.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer refunds for unused eSIMs within 7 days of purchase. Once an eSIM has been activated, it cannot be refunded. Please contact our support team to process a refund request.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption and security measures to protect your data. Your connection is as secure as using a traditional SIM card.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about eSIM Quantum
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-12 p-8 bg-orange-50 rounded-lg border border-orange-200 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you 24/7
          </p>
          <a href="/contact" className="text-orange-600 hover:text-orange-700 font-semibold">
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}
