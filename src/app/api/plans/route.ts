import { NextResponse } from 'next/server';
import { plans, countries } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('country');

  let filteredPlans = plans;

  if (countryCode) {
    filteredPlans = plans.filter(
      (plan) =>
        plan.countryCode === countryCode ||
        plan.coverage.some((c) =>
          c.toLowerCase().includes(countryCode.toLowerCase())
        )
    );
  }

  return NextResponse.json({
    success: true,
    plans: filteredPlans,
    countries,
  });
}
