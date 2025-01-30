import { NextResponse, NextRequest } from 'next/server';

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
  const { content, channelId, signerUUID } = await req?.json();
  
  if (!content || (!signerUUID && !process.env.AGENT_SIGNER_UUID)) 
    return NextResponse.json({ error: 'No valid content' }, { status: 500 });

  try {
    // cast max length is 1024 characters.. splitting in chunks
    const casts = splitInChunks(content);

    const success = [];  
    let previousCastHash = null;
    for (const cast of casts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'x-neynar-experimental': 'false',
          'x-api-key': process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          signer_uuid: process.env.AGENT_SIGNER_UUID || signerUUID, 
          text: cast,
          //embeds: [{url: frame}],
          channel_id: channelId ?? null,
          parent: previousCastHash
        })
      };
      const endpoint = `https://api.neynar.com/v2/farcaster/cast`;
      
      try {
        const response = await fetch(endpoint, options);
        const data = await response?.json(); 
        //console.log(data);     
        previousCastHash = data?.cast?.hash ?? null;
        success.push(data?.success ?? false);
      } catch (err) {
        console.log(err);
        success.push(false);
      }  
    } 
    console.log(success);
    
    return NextResponse.json({ 
      success: success.length === casts.length && !success.includes(false) 
    });
  } catch (error) {
    console.error('send-cast: API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send cast' },
      { status: 500 }
    );
  }
}
