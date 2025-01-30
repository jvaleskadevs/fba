import { 
  getOnchainClaudeResponse 
} from './llm_anthropic_with_wallet';

export async function getLLMResponse(
  input: string, 
  apiKey?: string, 
  tag?: string,
  signerUUID?: string, 
  wcApiKey?: string
): Promise<string[]> {
  return await getOnchainClaudeResponse(
    input, 
    apiKey, 
    tag,
    signerUUID, 
    wcApiKey
  );
}
