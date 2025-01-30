import { NextRequest, NextResponse } from "next/server";
import { getLLMResponse } from "../../lib/llm";

export async function POST(req: NextRequest): Promise<NextResponse> {  
  const { apiKey, tag, conversationId, input, signerUUID, wcApiKey } = await req?.json();
  
  console.log("tag", tag);
  
  if (!input) return NextResponse.json({ error: "No Valid Input" }, { status: 500 });
  
  const messages = await getLLMResponse(input, apiKey, tag, signerUUID, wcApiKey);
  
  if (!messages) return NextResponse.json({ error: "No Messages" }, { status: 500 });
  
  return NextResponse.json({ messages, conversationId });
}
