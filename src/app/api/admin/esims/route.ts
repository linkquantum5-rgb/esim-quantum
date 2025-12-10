import { NextResponse } from 'next/server';
import { physicalESIMs } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    success: true,
    esims: physicalESIMs,
  });
}
