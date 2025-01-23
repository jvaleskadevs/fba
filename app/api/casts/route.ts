import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');

  if (!fid) {
    return NextResponse.json({ casts: [] });
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
      `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=5&include_replies=false`,
      options
    );
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data?.casts ?? []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
