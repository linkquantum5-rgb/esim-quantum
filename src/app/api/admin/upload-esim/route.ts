import { NextResponse } from 'next/server';
import { physicalESIMs } from '@/lib/data';
import { PhysicalESIM } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { countryCode, planId, qrCode, qrCodeType } = body;

    if (!countryCode || !planId || !qrCode || !qrCodeType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newESIM: PhysicalESIM = {
      id: `esim-${Date.now()}`,
      countryCode,
      planId,
      qrCode,
      qrCodeType,
      status: 'available',
    };

    physicalESIMs.push(newESIM);

    return NextResponse.json({
      success: true,
      esim: newESIM,
      message: 'eSIM uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
