import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api.weather-ai.co/v1/weather';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`${API_BASE}?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("WeatherAPI Error:", response.status, errorText);
      return NextResponse.json(
        { error: `Weather API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}