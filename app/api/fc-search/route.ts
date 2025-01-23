import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ users: [] });
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-neynar-experimental': 'false',
      'x-api-key': process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS'
    }
  };

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(query)}&limit=5`,
      options
    );
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data?.result ?? {});
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
