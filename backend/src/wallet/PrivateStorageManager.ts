import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

import { decryptToString, encryptString } from "@lit-protocol/encryption";
import { LIT_NETWORK } from "@lit-protocol/constants";
import dotenv from "dotenv";
import { WalletData } from "@coinbase/coinbase-sdk";
import DatabaseManager from "src/database/DatabaseManager";

dotenv.config();

export interface UserWalletData {
  userId: string;
  agentWallet: string | undefined;
  walletData: WalletData | undefined;
}

export class PrivateLitStorageService {
  private chain: string = process.env.LIT_NETWORK_ID || "baseSepolia";
  private litClient: LitJsSdk.LitNodeClientNodeJs;
  private isConnected: boolean = false;

  constructor() {
    this.litClient = new LitJsSdk.LitNodeClientNodeJs({
      litNetwork: LIT_NETWORK.DatilTest,
    });
    this.initLitClient();
  }

  private async initLitClient(): Promise<void> {
    if (!this.isConnected) {
      console.log("🔄 Connecting to Lit Protocol...");
      await this.litClient.connect();
      this.isConnected = true;
      console.log("✅ Lit Protocol Client Connected!");
    }
  }

  // Encrypt & Store Mapping in Lit Protocol
  async storeWalletMapping({
    userId,
    agentWallet,
    walletData,
  }: UserWalletData) {
    try {
      await this.initLitClient();

      const dbService = await DatabaseManager.getInstance();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: this.chain,
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: userId,
          },
        },
      ];

      const encodedData = JSON.stringify({ userId, agentWallet, walletData });

      const { ciphertext, dataToEncryptHash } = await encryptString(
        { dataToEncrypt: encodedData, accessControlConditions },
        this.litClient
      );

      console.log(`🔒 Encrypted Mapping Stored for User: ${userId}`);

      await dbService.storeWalletData(userId, ciphertext, dataToEncryptHash);

      return { ciphertext, dataToEncryptHash };
    } catch (error: any) {
      console.error("❌ Error encrypting and storing wallet mapping:", error);
      console.error(error.message);
    }
  }

  // Retrieve the agent wallet address mapped to a user from Lit Protocol
  public async getAgentWalletData(
    userId: string
  ): Promise<UserWalletData | null> {
    try {
      await this.initLitClient();

      const dbService = await DatabaseManager.getInstance();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: this.chain,
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: userId,
          },
        },
      ];

      const dbUserData = await dbService.getWalletData(userId);

      if (!dbUserData) {
        return null;
      }

      const decryptedData = await decryptToString(
        {
          ciphertext: dbUserData.ciphertext,
          dataToEncryptHash: dbUserData.dataHash,
          chain: this.chain,
          accessControlConditions,
        },
        this.litClient
      );

      const parsedData: UserWalletData = JSON.parse(decryptedData);
      return parsedData || null;
    } catch (error) {
      console.error(
        "❌ Error retrieving agent wallet from Lit Protocol:",
        error
      );
      return null;
    }
  }
}

export default PrivateLitStorageService;
