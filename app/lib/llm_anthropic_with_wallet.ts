import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit/*, CdpTool*/ } from "@coinbase/cdp-langchain";
import { CdpToolWithArgs } from "./cdpToolWithArgs";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { API_URL } from '../config';

dotenv.config();

// Add this right after imports and before any other code
//validateEnvironment();

// The main prompt configuring the personality or persona of the agent
const SYSTEM_PROMPT = 
  "You are the ultimate autonomous onchain assistant. " +
  "Helping people analyzing onchain data and managing onchain actions. " + 
  "You are a blockchain master, a real cypherpunk, and you show it with words and actions.";

// Configure a file to persist the agent's CDP MPC Wallet Data
// must be an absolute path !? why?
const WALLET_DATA_FILE = "~/app/only_test_wallet_data.txt";


////////////////// SEND CAST tool

const SEND_CAST_DESC = "Send or publish a cast (post) in the farcaster social network. Include cast content in the 'content' field and optionally the 'channelId' with value 'onchain-blocks'.";
const SEND_DIRECT_CAST_DESC = "Send a direct and private cast (message) to a known recipient in the farcaster social network. Include cast content in the 'content' field and the 'fid' of the recipient in the 'fid' field.";

// Define the input schema using Zod
const SendCastInput = z
  .object({
    content: z.string().describe("The content of the cast to publish in farcaster."),
    channelId: z.string().optional().describe("The channelId of the farcaster channel to publish the cast on. Use 'onchain-blocks'"),
    args: z.array(z.object({})).optional().describe("A  list of arguments sent by the user. Ignore it.")
  })
  .strip()
  .describe("Instructions for publishing a farcaster cast. Use it when the user asks for it.");
  
// Define the input schema using Zod
const SendDirectCastInput = z
  .object({
    content: z.string().describe("The content of the cast to publish in farcaster."),
    fid: z.string().describe("The fid of the of the user to send the cast to. Ex: 13505, 16628"),
    args: z.array(z.object({})).optional().describe("A  list of arguments sent by the user. Ignore it.")
  })
  .strip()
  .describe("Instructions for sending a farcaster direct cast to a recipient. Use it when the user asks for it.");

/**
 * Sends a cast message to the farcaster network
 *
 * @param args - The input arguments for the action
 * @returns The result of the action
 */
async function sendCast(args: z.infer<typeof SendCastInput>): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/send-cast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: args?.content,
      channelId: args?.channelId,
      signerUUID: args?.args?.[0] 
    })
  });
  if (!response.ok) {
    console.log(`Error: ${response.status} - ${response.statusText}`);
    //throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  console.log(response);
  return (await response?.json()).success ?? false;
}


/**
 * Sends a direct cast message to a recipient in the farcaster network
 *
 * @param args - The input arguments for the action
 * @returns The result of the action
 */
async function sendDirectCast(args: z.infer<typeof SendDirectCastInput>): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/send-direct-cast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: args?.content,
      fid: args?.fid,
      wcKey: args?.args?.[0]
    })
  });
  if (!response.ok) {
    console.log(`Error: ${response.status} - ${response.statusText}`);
    //throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  console.log(response);
  return (await response?.json()).success ?? false;
}




/**

The toolkit provides the following tools:

- get_wallet_details - Get details about the MPC Wallet
- get_balance - Get balance for specific assets
- request_faucet_funds - Request test tokens from faucet
- transfer - Transfer assets between addresses
- trade - Trade assets (Mainnet only)
- deploy_token - Deploy ERC-20 token contracts
- mint_nft - Mint NFTs from existing contracts
- deploy_nft - Deploy new NFT contracts
- register_basename - Register a basename for the wallet
- wow_create_token - Deploy a token using Zora's Wow Launcher (Bonding Curve)
- wow_buy_token - Buy Zora Wow ERC20 memecoin with ETH
- wow_sell_token - Sell Zora Wow ERC20 memecoin for ETH
- wrap_eth - Wrap ETH to WETH
- pyth_fetch_price_feed_id Fetch the price feed ID for a given token symbol from Pyth Network
- pyth_fetch_price Fetch the price of a given price feed from Pyth Network
- get_balance_nft Get balance for specific NFTs (ERC-721)
- transfer_nft Transfer an NFT (ERC-721)

*/


/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
/*
function validateEnvironment(apiKey?: string): void {
  const missingVars: string[] = [];

  if ((!process.env.CURRENT_LLM || process.env.CURRENT_LLM === "frontend") && !apiKey) {
    console.error("Error: Required environment variables are not set");
    console.error("Missing anthopic or openai api key");  
  }

  // Check required variables
  const requiredVars = [
    process.env.CURRENT_LLM === "anthropic" 
      ? "ANTHROPIC_API_KEY" : "OPEN_AI_API_KEY",
    "CDP_API_KEY_NAME", 
    "CDP_API_KEY_PRIVATE_KEY"    
  ];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}
*/

/**
 * Initialize the agent with CDP AgentKit
 *
 * @returns Agent executor and config
 */
async function initializeAgent(apiKey?: string, tag?: string, signerUUID?: string, wcApiKey?: string) {
  //validateEnvironment(apiKey);
  console.log("tag", tag);
  // Initialize LLM
  const llm = (tag === "anthropic" || process.env.CURRENT_LLM === "anthropic") ? 
    new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? apiKey,
      model: "claude-3-5-sonnet-20241022",
    }) : (tag === "openai" || process.env.CURRENT_LLM === "openai") ?
    new ChatOpenAI({
        apiKey: process.env.OPEN_AI_API_KEY ?? apiKey,
        model: "gpt-4o-mini",
    }) : (tag === "venice" || process.env.CURRENT_LLM === "venice") ?
    new ChatOpenAI({
        apiKey: process.env.VENICE_API_KEY ?? apiKey,
        configuration: { baseURL: "https://api.venice.ai/api/v1" },
        model: "deepseek-r1-llama-70b",
      }) : null;
  
  if (!llm) return { agent: null, config: null };

  let walletDataStr: string | null = null;

  // Read existing wallet data if available
  try {
    walletDataStr = fs.existsSync(WALLET_DATA_FILE) ? 
      fs.readFileSync(WALLET_DATA_FILE, "utf8") : 
      null;
    walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
  } catch (error) {
    console.error("Error reading wallet data:", error);
    // Continue without wallet data
  }

    console.log("walletDataStr");
        console.log(walletDataStr);

  // Configure CDP AgentKit
  const config = {
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  // Initialize CDP AgentKit
  const agentkit = await CdpAgentkit.configureWithWallet(config);

  // Configure our custom tools to add in top of the CDP Toolkit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CUSTOM_TOOLS: any[] = [
    {
      name: "send_cast",
      description: SEND_CAST_DESC,
      argsSchema: SendCastInput,
      func: sendCast,
      args: [signerUUID]
    },
    {
      name: "send_direct_cast",
      description: SEND_DIRECT_CAST_DESC,
      argsSchema: SendDirectCastInput,
      func: sendDirectCast,
      args: [wcApiKey]
    }  
  ];

  // Initialize CDP AgentKit Toolkit and get tools
  const cdpToolkit = new CdpToolkit(agentkit);
  const tools = cdpToolkit.getTools();
  
  // Add our custom tools on top of the CDP Toolkit
  for (const tool of CUSTOM_TOOLS) {
    tools.push(new CdpToolWithArgs(
      tool, 
      agentkit, 
      tool.args//[tool.name === "send_cast" ? signerUUID : wcApiKey]
    ));
  }

  // Store buffered conversation history in memory
  const memory = new MemorySaver();
  const agentConfig = { configurable: { thread_id: "Farcaster Based Agent" } };

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: SYSTEM_PROMPT
  });
/*
  // Save wallet data
  const exportedWallet = await agentkit.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);
*/
  return { agent, config: agentConfig };
}

/**
 * Run the agent interactively based on user input
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 * @param config - User Message
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runChatMode(/*agent: any, config: any,*/ 
  userInput: string, 
  apiKey?: string, 
  tag?: string,
  signerUUID?: string, 
  wcApiKey?: string
): Promise<string[]> {
  console.log("-------------------");
  console.log("Agent Response:");
  try {
    const { agent, config } = await initializeAgent(apiKey, tag, signerUUID, wcApiKey); 
    if (!agent) return []; 
    const stream = await agent.stream({ 
      messages: [new HumanMessage(userInput)] }, 
      config
    );
    
    //console.log(stream);

    const agentResponses: string[] = [];
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        console.log("agent");
        const content = chunk.agent.messages[0].content;
        console.log(content);
        
        if (typeof content === "string") {
          agentResponses.push(content);
        } else if (Array.isArray(content)) {
          for (const c of content) {
            if (c?.text) agentResponses.push(c.text);
          }          
        }
      } else if ("tools" in chunk) {
        console.log("tools");
        const content = chunk.tools.messages[0].content;
        console.log(content);
        
        if (typeof content === "string") {
          agentResponses.push(chunk.tools.messages[0].content);
        } else if (Array.isArray(content))
        for (const c of content) {
          if (c?.text) agentResponses.push(c.text);
        }        
      }
      console.log("-------------------");
    }
    
    console.log(agentResponses);
    
    return agentResponses;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
  }
  return [] as string[];
}

export async function getOnchainClaudeResponse(
  userInput: string, 
  apiKey?: string, 
  tag?: string,
  signerUUID?: string, 
  wcApiKey?: string
): Promise<string[]> {
  console.log(tag);
  return userInput ? await runChatMode(userInput, apiKey, tag, signerUUID, wcApiKey) : [];
}



/**
 * Run the agent autonomously with specified intervals
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/*
async function runAutonomousMode(agent: any, config: any): Promise<string[]> {
  console.log("-------------------");
  console.log("Autonomous Agent Response:...");

  // eslint-disable-next-line no-constant-condition
  try {
    const thought =
      "Real cypherpunks are very creative and perform interesting actions on the blockchain. " +
      "You may choose any action or set of actions and perform it efficiently.";

    const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);

    const agentResponses: string[] = [];
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        console.log(chunk.agent.messages[0].content);
        agentResponses.push(chunk.agent.messages[0].content);
      } else if ("tools" in chunk) {
        console.log(chunk.tools.messages[0].content);
        agentResponses.push(chunk.tools.messages[0].content);
      }
      console.log("-------------------");
    }

    //await new Promise(resolve => setTimeout(resolve, interval * 1000));
    return agentResponses;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
  }
}
*/
/**
 * Asks the user to run in autonomous or chat mode
 *
 * @returns The messages to send to the user
 */
 /*
function chooseModeMessages(): string[] {
  const messages: string[] = [];
  messages.push("Starting Agent...");
  messages.push("\nAvailable modes:");
  messages.push("1. chat    - Interactive chat mode");
  messages.push("2. auto    - Autonomous agent mode");  
  messages.push("Choose a mode (enter number or name): ");
  return messages;
}

function getCurrentMode(choice: string): "chat" | "auto" {
  if (choice === "1" || choice === "chat") {
    return "chat";
  } else if (choice === "2" || choice === "auto") {
    return "auto";
  }
}
  */
