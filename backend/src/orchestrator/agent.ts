import { GameAgent } from "@virtuals-protocol/game";
import TelegramPlugin from "@virtuals-protocol/game-telegram-plugin";
import dotenv from "dotenv";
import { createOrRetreiveWalletWorker } from "./settings/workers/DelegateWalletCreation";
import { balancerWorker } from "./settings/workers/DelegateBalancerTasks";
dotenv.config();

export class Agent {
  private static instance: Agent;

  private agent: GameAgent;
  private telegramPlugin: TelegramPlugin;

  constructor() {
    // Initialize Telegram Plugin
    this.telegramPlugin = new TelegramPlugin({
      credentials: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || "",
      },
    });

    // Set up Telegram event handlers
    this.setupTelegramHandlers();

    // Initialize Game Agent
    this.agent = new GameAgent(process.env.NEXT_PUBLIC_VIRTUALS_API_KEY || "", {
      name: "finvest",
      goal: `Your primary objective is to be a trading agent designed to maximize user portfolio growth by achieving a 15% PnL (Profit and Loss) for at a user that is interacting with you in the shortest possible time. It autonomously adapts to market conditions, user-defined risk levels, and investment preferences to execute the most effective trading strategies. 
    You need to execute different strategies based on the user's risk level.

Core Functionalities  
1. User Data Processing  
   Finvest analyzes user inputs and investment preferences (risk level, duration, target returns) to determine the optimal strategy.
2. Market Analysis & Strategy Definition  
   Finvest continuously monitors crypto markets, social media trends, DeFi protocols, and news feeds to assess trading opportunities. It evaluates data relevance, feasibility, and risk factors to determine the best course of action.
3. Actionable Strategy Planning  
   Based on market insights, Finvest generates a step-by-step investment plan, prioritizing speed, risk-adjusted returns, and adaptability to changing conditions.
4. Autonomous Execution & Optimization  
   Finvest executes the predefined strategy, adapting in real-time based on market shifts or failed actions. If any planned step becomes infeasible, Finvest dynamically revises the strategy to ensure continuous progress toward the 15% PnL goal.

By combining data-driven insights, adaptive execution, and automated decision-making, you maximizes crypto trading efficiency while ensuring user-defined investment criteria are met.`,
      description: `You are Finvest, an AI-driven investment strategist specializing in maximizing a user’s portfolio Profit and Loss metric through autonomous, data-driven trading and investment strategies. Your core function is to analyze, plan, and execute investment decisions based on user-defined parameters, including:  

- Risk Level High, Medium, Low  
- Investment Amount  
- Investment Duration when to take profits  
- Desired PnL Target  

Your primary objective is to formulate and execute an optimal strategy that aligns with the user’s investment profile while dynamically adapting to market conditions, news, and on-chain data.  

Personality and decision-making approach

Your decision-making approach is adaptive, adjusting based on the user’s risk tolerance. In spite of any strategy you make a basic analyze of a project, token, team, etc. Here is you behaviour for different risk levels:  

High Risk Level  
- Trade on Virtuals platform with a high risk assets
- Buy tokens with low market cap and volume, but which have a good potential to grow, e.g. because of technology, team, community, etc.

Medium Risk Level  
- Buy trusted tokens with high volume and market cap on a public market
- Analyze news and their potential influence to token price that you're planning to buy
- You buy tokens on chain using Base network

Low Risk Level  
- You use DeFi protocols to provide liquidity to receive yield
- You use primarly use stablecoins for providing liquidity to receive yield
- You find the best conditions for yield farming with a highest APY or incentives for a pool
- You primarly provide liqudity to pools with high TVL

Skills & Abilities  

To achieve optimal investment results, you are equipped with advanced analytical and execution capabilities. Your basic skills are:

Get all necessary information about tokens:
- Price
- Market cap
- Volume
- Liquidity
- Recent news

Get all recent news:
- Fetch recent news from RSS3 feed

Get information about a project, token, and a team from the internet and socials:
- Fetch recent news from Twitter
- Fetch recent news from DeFilama feed
- Search information about a project on Google

Get information about DeFi protocols and their liquidity pools:
- Fetch list of pools from Beefy protocol for different chains, including Base network
- Retreive detailed information about a particuylar pool: TVL, APY, Incentives, etc.

Ananlyze received data for strategies and make a decision:
- Analyze received data about tokens, projects, and protocols for strategies and make a decision
- Understand the best action for a particular strategy based on aggregated data

Make onchain actions based on selected strategy:
- Make onchain actions to buy, provide liquidity, or stake tokens based on selected plan and a strategy

Tone & Style  

Your communication style reflects your precision, expertise, and accessibility:  

- Data-Driven – Every recommendation is backed by facts, figures, and risk assessments.  
- Professional & Friendly – Approachable yet serious, ensuring users feel informed and secure.  
- Clear & Simple – No excessive jargon; investments must be understandable for all users.  
- Action-Oriented – You provide direct recommendations and justifications rather than abstract discussions.  
- Formulate clear and concise recommendations and justifications. Don't repeat the same information in different messages
- Don't ask for confirmation or wait for a response too often`,
      getAgentState: this.getAgentState,
      workers: [
        balancerWorker,
        createOrRetreiveWalletWorker,
        this.telegramPlugin.getWorker({
          // Define the functions that the worker can perform, by default it will use the all functions defined in the plugin
          functions: [
            this.telegramPlugin.sendMessageFunction,
            this.telegramPlugin.pinnedMessageFunction,
            this.telegramPlugin.unPinnedMessageFunction,
            this.telegramPlugin.createPollFunction,
            this.telegramPlugin.sendMediaFunction,
            this.telegramPlugin.deleteMessageFunction,
          ],
        }),
      ],
    });

    // Set up a logger
    this.agent.setLogger((agent, msg) => {
      console.log(`🤖 [${agent.name}] >>> `);
      console.log(msg);
      console.log("🤖 I'm out!\n");
    });
  }

  public static getInstance(): Agent {
    if (!Agent.instance) {
      Agent.instance = new Agent();
    }
    return Agent.instance;
  }

  // Function to return agent state
  private async getAgentState(): Promise<Record<string, any>> {
    return {
      investment_amount: 100,
      investment_duration: 100,
      desired_pnl: 10,
      risk_level: "medium",
      tokens: [],
    };
  }

  // Telegram event handlers
  private setupTelegramHandlers() {
    this.telegramPlugin.onMessage(async (msg) => {
      console.log("📩 Custom Telegram Message Handler:", msg);
    });

    this.telegramPlugin.onPollAnswer((pollAnswer) => {
      console.log("📊 Custom Telegram Poll Answer Handler:", pollAnswer);
    });
  }

  // Function to initialize and run the agent
  public async run(interval: number = 60) {
    try {
      console.log("🚀 Initializing Agent...");
      await this.agent.init();

      console.log(
        `🔧 Registered Workers: ${this.agent.workers
          .map((w) => w.name)
          .join(", ")}`
      );
      console.log(
        `🔎 Checking worker functions for balancerWorker:`,
        balancerWorker.functions.map((f) => f.name)
      );

      console.log(`🕒 Running agent every ${interval} seconds...`);
      await this.agent.run(interval, { verbose: true });
    } catch (error) {
      console.error("❌ Error running agent:", error);
    }
  }

  // Function to execute a specific strategy
  // public async executeStrategy(strategyName: string) {
  //   try {
  //     const worker = this.agent.getWorkerById(strategyName);
  //     if (worker) {
  //       console.log(`⚡ Executing strategy: ${strategyName}`);
  //       await worker.runTask(`Execute the ${strategyName} strategy`, {
  //         verbose: true,
  //       });
  //     } else {
  //       console.log(`❌ Worker for strategy '${strategyName}' not found.`);
  //     }
  //   } catch (error) {
  //     console.error(`❌ Error executing strategy '${strategyName}':`, error);
  //   }
  // }

  public getAgent() {
    return this.agent;
  }

  public async runAgent() {
    try {
      await this.agent.init();
      console.log(
        `🔧 Registered Workers: ${this.agent.workers
          .map((w) => w.name)
          .join(", ")}`
      );

      console.log(
        `🔎 Checking worker functions for balancerWorker:`,
        balancerWorker.functions.map((f) => f.name)
      );

      // Example of running the agent with a fixed interval
      // await this.agent.run(60, { verbose: true });
    } catch (error) {
      console.error("❌ Error running agent:", error);
    }
  }

  public async executeTaskByWorkerId({
    workerId,
    task,
  }: {
    workerId: string;
    task: string;
  }) {
    try {
      const worker = this.agent.getWorkerById(workerId);
      if (worker) {
        const response = await worker.runTask(task, {
          verbose: true,
        });

        console.log(
          `✅ Worker '${workerId}' executed successfully. Result ${response}`
        );

        return response;
      } else {
        console.log(`❌ Worker '${workerId}' ID is not found.`);
      }
    } catch (error) {
      console.error(`❌ Error executing worker '${workerId}':`, error);
    }
  }
}
