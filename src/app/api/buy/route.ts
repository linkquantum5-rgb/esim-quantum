import { NextResponse } from 'next/server';
import { plans, physicalESIMs } from '@/lib/data';
import { Customer, Order, CartItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer } = body as { items: CartItem[]; customer: Customer };

    // Validate customer data
    if (!customer.email || !customer.country || !customer.deviceType) {
      return NextResponse.json(
        { success: false, error: 'Missing customer information' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce((sum, item) => {
      const plan = plans.find((p) => p.id === item.plan.id);
      return sum + (plan?.price || 0) * item.quantity;
    }, 0);

    // Assign physical eSIMs or generate API-based eSIMs
    const assignedESIMs = [];

    for (const item of items) {
      const plan = plans.find((p) => p.id === item.plan.id);
      if (!plan) continue;

      for (let i = 0; i < item.quantity; i++) {
        if (plan.type === 'physical') {
          // Find available physical eSIM
          const availableESIM = physicalESIMs.find(
            (esim) => esim.planId === plan.id && esim.status === 'available'
          );

          if (availableESIM) {
            availableESIM.status = 'sold';
            availableESIM.soldAt = new Date();
            availableESIM.customerEmail = customer.email;
            assignedESIMs.push(availableESIM);
          } else {
            return NextResponse.json(
              { success: false, error: 'No physical eSIMs available for this plan' },
              { status: 400 }
            );
          }
        } else {
          // API-based eSIM - would connect to provider like eSIMgo
          // For now, generate a mock eSIM
          const mockESIM = {
            id: `api-${Date.now()}-${i}`,
            countryCode: plan.countryCode,
            planId: plan.id,
            qrCode: `LPA:1$api.eSIM Quantum.com$ACTIVATION-${Date.now()}-${i}`,
            qrCodeType: 'text' as const,
            status: 'sold' as const,
            soldAt: new Date(),
            customerEmail: customer.email,
          };
          assignedESIMs.push(mockESIM);
        }
      }
    }

    // Create order
    const order: Order = {
      id: `ORD-${Date.now()}`,
      customer,
      items,
      total,
      status: 'completed',
      createdAt: new Date(),
      assignedESIMs,
    };

    // In production, save order to database and send email
    console.log('Order created:', order);

    return NextResponse.json({
      success: true,
      order,
      message: 'Purchase completed successfully',
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { success: false, error: 'Purchase failed' },
      { status: 500 }
    );
  }
}
