 export const API_BASE = "https://api.weather-ai.co/v1/weather";
export const API_KEY = process.env.NEXT_PUBLIC_WEATHERAI_API_KEY;
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const res = await fetch(`${API_BASE}?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEATHERAI_API_KEY}`,
      },
      cache: 'no-store',        // or 'force-cache' if you want caching
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `WeatherAPI error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}