import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = "You are the ultimate autonomous onchain assistant. Helping people analyzing onchain data and managing onchain actions. You are a truly blockchain master, a real cypherpunk.";

const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";
const MAX_TOKENS = 192;

const DEPLOY_TOKEN = "deploy_token";

const TOOLS: Anthropic.Tool[] = [
  {
    name: DEPLOY_TOKEN,
    description: "Deploy an erc20z token in WOW (a fair launch platform).",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the token selected by the user."
        },
        symbol: {
          type: "string",
          description: "The symbol, also called ticker, of the token selected by the user"
        }
      },
      required: ["name", "symbol"]
    }
  }
];

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const getClaudeResponse = async (messages: Array<Anthropic.MessageParam>): Promise<Anthropic.Message & { _request_id?: string | null | undefined; } | undefined> => {
  if (!messages || messages.length !== 0) return undefined;
  
  const content = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages,
    tools: TOOLS,
    tool_choice: { type: "auto" }
  });
  //console.log(content); 
  
  return content;
}
