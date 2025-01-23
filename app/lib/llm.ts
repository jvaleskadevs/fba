import { getOnchainClaudeResponse } from './llm_anthropic_with_wallet';

export async function getLLMResponse(input: string, apiKey: string): Promise<string[]> {
  return await getOnchainClaudeResponse(input, apiKey);
}
