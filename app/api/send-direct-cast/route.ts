import { NextResponse, NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const splitInChunks = (content: string): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i+=1000) {
    if (content.length < i+1000) {
      chunks.push(content.substring(i));
    } else {
      chunks.push(content.substring(i, i+1000));
    }
  }
  return chunks;  
}

export async function POST(req: NextRequest) {
  const { content, fid, wcKey } = await req?.json();

  if (!content || !fid) return NextResponse.json({ error: 'No valid content|fid' }, { status: 500 });
  if (!process.env.WC_API_KEY && !wcKey) return  NextResponse.json({ error: 'No warpcast key' }, { status: 500 }); 

  try {
    // cast max length is 1024 characters.. splitting in chunks
    const directCasts = splitInChunks(content);
    
    const success = [];
    for (const cast of directCasts) {
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.WC_API_KEY || wcKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipientFid: fid,
          message: cast,
          idempotencyKey: uuidv4(),
        })
      }
      const endpoint = "https://api.warpcast.com/v2/ext-send-direct-cast";
      
      try {
        const response = await fetch(endpoint, options);
        const data = await response?.json();
        //console.log(data);
        success.push(data?.result?.success ?? false);
      } catch (err) {
        console.log(err);
        success.push(false);
      }  
    }
    
    return NextResponse.json({ 
      success: success.length === directCasts.length && !success.includes(false) 
    });
  } catch (error) {
    console.error('send-direct-cast: API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send direct cast' },
      { status: 500 }
    );
  }
}
