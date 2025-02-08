import {
  AgentKit,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  CdpWalletProvider,
  erc20ActionProvider,
  walletActionProvider,
} from "@coinbase/agentkit";
import dotenv from "dotenv";

import {
  PrivateLitStorageService,
  UserWalletData,
} from "src/executor/PrivateStorageManager";
import { manageBalancerLiquidityProvider } from "./custom-actions/BalancerProviders";
dotenv.config();

class AgentKitService {
  private privateStorageManager: PrivateLitStorageService =
    new PrivateLitStorageService();

  private walletProvider!: CdpWalletProvider;
  private agentKit!: AgentKit;

  private constructor() {}

  public static async createInstance(
    userHashId: string
  ): Promise<AgentKitService> {
    const service = new AgentKitService();
    await service.init(userHashId);
    return service;
  }

  private async init(userHashId: string) {
    console.log(`🔄 Initializing AgentKit for User: ${userHashId}...`);

    try {
      console.log(`🔹 Retrieve wallet mapping from Lit Protocol`);
      const existingWalletData: UserWalletData | null =
        await this.privateStorageManager.getAgentWalletData(userHashId);

      if (existingWalletData) {
        console.log(`🔄 Found existing wallet for User: ${userHashId}`);
        this.walletProvider = await CdpWalletProvider.configureWithWallet({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
          cdpWalletData: JSON.stringify(existingWalletData.walletData),
          networkId: process.env.WALLET_PROVIDER_NETWORK_ID || "base-sepolia",
        });
      } else {
        console.log(`⚡ Creating new wallet for User: ${userHashId}`);
        this.walletProvider = await CdpWalletProvider.configureWithWallet({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
          networkId: process.env.WALLET_PROVIDER_NETWORK_ID || "base-sepolia",
        });

        console.log(`🔹 Store wallet mapping securely using Lit Protocol`);
        await this.privateStorageManager.storeWalletMapping({
          userId: userHashId,
          agentWallet: this.getAgentWalletAddress(),
          walletData: await this.getWalletData(),
        });
      }

      console.log(`🔹 Initialize AgentKit with the correct wallet`);
      this.agentKit = await AgentKit.from({
        walletProvider: this.walletProvider!,
        actionProviders: [
          // Custom providers
          manageBalancerLiquidityProvider,

          walletActionProvider(),
          erc20ActionProvider(),
          cdpApiActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
              /\\n/g,
              "\n"
            ),
          }),
          cdpWalletActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
              /\\n/g,
              "\n"
            ),
          }),
        ],
      });

      console.log(`✅ AgentKit initialized for User: ${userHashId}`);
    } catch (error: any) {
      console.error(`❌ Error initializing AgentKit for User: ${userHashId}`);
      console.error(error.message);
    }
  }

  public getAgentWalletAddress() {
    return this.walletProvider?.getAddress();
  }

  public async getWalletData() {
    return await this.walletProvider?.exportWallet();
  }

  public getAgentKitInstance(): AgentKit {
    return this.agentKit;
  }

  public async askRequest(args: any) {
    console.log(`🔹 Retreiveing all agent actions...`);
    const actions = this.agentKit.getActions();

    console.log(`🔹 Found ${actions.length} actions`);

    const balancerLiquidityAction = actions.find((action) => {
      console.log(`🔹 Action name: ${action.name}`);
      return action.name === "CustomActionProvider_manage_balancer_liquidity";
    });

    console.log(
      `🔹 Balancer liquidity action found: ${balancerLiquidityAction}`
    );
    const result = await balancerLiquidityAction?.invoke(args);

    console.log(`🔹 Agent processed the request. Pools output: ${result}`);

    return result;
  }
}

export default AgentKitService;
