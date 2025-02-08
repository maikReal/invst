import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { z } from "zod";

import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { getPortfolio } from "src/tools/blockscout/portfolio";

interface PortfolioInputTypes {
  walletAddress: string;
  chainId: number;
  types?: string[];
  needToFilterDust?: boolean;
}

export const fetchPortfolioProvider = customActionProvider<EvmWalletProvider>({
  name: "fetch_portfolio",
  description:
    "Fetch tokens and native token balance for a given wallet address, chain id, and types of tokens to fetch",
  schema: z.object({
    walletAddress: z
      .string()
      .describe("The wallet address to fetch the portfolio for"),
    chainId: z.number().describe("The chain id to fetch the portfolio for"),
    types: z
      .array(z.string())
      .describe("The types of tokens to fetch")
      .default(["ERC-20"])
      .optional(),
    needToFilterDust: z
      .boolean()
      .describe("Whether to filter dust tokens")
      .default(true)
      .optional(),
  }),
  invoke: async (walletProvider, args: PortfolioInputTypes) => {
    const { walletAddress, chainId, types, needToFilterDust } = args;

    try {
      const portfolio = await getPortfolio({
        walletAddress: walletAddress,
        chainId: chainId,
        types: types,
        needToFilterDust: needToFilterDust,
      });

      const nativeTokenBalance = await walletProvider.getBalance();

      return { nativeToken: nativeTokenBalance, tokens: portfolio };
    } catch (error) {
      console.error(
        "❌ Error fetching portfolio for wallet address:",
        walletAddress,
        "on chain id:",
        chainId,
        "with types:",
        types,
        "and needToFilterDust:",
        needToFilterDust,
        "error:",
        error
      );
      return { error: (error as Error).message };
    }
  },
});
