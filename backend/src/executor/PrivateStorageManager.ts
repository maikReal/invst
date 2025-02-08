import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

import { decryptToString, encryptString } from "@lit-protocol/encryption";
import {
  LIT_ABILITY,
  LIT_NETWORK,
  LIT_RPC,
  LitAbility,
} from "@lit-protocol/constants";
import dotenv from "dotenv";
import { WalletData } from "@coinbase/coinbase-sdk";
import DatabaseManager from "src/database/DatabaseManager";
import {
  createSiweMessage,
  generateAuthSig,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";
import * as ethers from "ethers";

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
  private ethersSigner: ethers.Wallet;
  constructor() {
    this.litClient = new LitJsSdk.LitNodeClientNodeJs({
      litNetwork: LIT_NETWORK.DatilTest,
    });
    this.initLitClient();

    if (!process.env.ETHEREUM_PRIVATE_KEY) {
      throw new Error("ETHEREUM_PRIVATE_KEY is not set");
    }

    this.ethersSigner = new ethers.Wallet(
      process.env.ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );
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

      console.log(`🔑 Found wallet for User: ${userId}`);

      const sessionSigs = await this.getSessionSignatures();

      console.log(`🔑 Session Sigs: ${sessionSigs}`);

      if (!dbUserData) {
        console.log(`❌ No wallet found for User: ${userId}`);
        return null;
      }

      const decryptedData = await decryptToString(
        {
          ciphertext: dbUserData.ciphertext,
          dataToEncryptHash: dbUserData.dataHash,
          chain: this.chain,
          accessControlConditions,
          sessionSigs,
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

  async getSessionSignatures() {
    const sessionSignatures = await this.litClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LIT_ABILITY.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: this.ethersSigner.address,
          nonce: await this.litClient.getLatestBlockhash(),
          litNodeClient: this.litClient,
        });

        return await generateAuthSig({
          signer: this.ethersSigner,
          toSign,
        });
      },
    });

    return sessionSignatures;
  }
}

export default PrivateLitStorageService;
