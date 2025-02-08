import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { BalancerManager, PoolFilters } from "src/tools/balancer/manager";
import { z } from "zod";

type BalancerPoolsInput = PoolFilters & { chainId: number };

export const poolsFiltersSchema = z.object({
  apr: z.number().optional(),
  minTvl: z.number().optional(),
  liquidity: z.number().optional(),
  poolType: z.string().optional(),
  chainId: z.number().optional(),
});

export const manageBalancerLiquidityProvider =
  customActionProvider<EvmWalletProvider>({
    name: "manage_balancer_liquidity",
    description:
      "Fetch Balancer pools based on provided filters and add or remove liquidity if needed. Prints logs of actions and errors.",
    schema: poolsFiltersSchema,
    invoke: async (walletProvider, args: BalancerPoolsInput) => {
      const { apr, minTvl, liquidity, poolType, chainId } = args;

      const balancerManager = new BalancerManager();

      try {
        const pools = await balancerManager.getPools(chainId, {
          apr,
          minTvl,
          liquidity,
          poolType,
        });

        console.log(`🔹 Found ${pools.length} pools`);

        return {
          action_result: {
            success: true,
            data: pools,
            feedback_message: `Found ${pools.length || 0} Balancer pools`,
          },
        };
      } catch (error) {
        return {
          action_result: {
            success: false,
            error: `Error faced when interacting wuth Balancer: ${error}`,
          },
        };
      }
    },
  });

// export const addLiquidityToPools = customActionProvider<EvmWalletProvider>({
//   name: "add_liquidity_to_pools",
//   description: "Add liquidity to provided Balancer pools",
//   schema: z.object({
//     walletAddress: z
//       .string()
//       .describe("The wallet address to fetch the portfolio for"),
//     chainId: z.number().describe("The chain id to fetch the portfolio for"),
//     types: z
//       .array(z.string())
//       .describe("The types of tokens to fetch")
//       .default(["ERC-20"])
//       .optional(),
//     needToFilterDust: z
//       .boolean()
//       .describe("Whether to filter dust tokens")
//       .default(true)
//       .optional(),
//   }),
//   invoke: async (walletProvider, args: any) => {
//     const { walletAddress, chainId, types, needToFilterDust } = args;

//     try {
//     } catch (error) {
//       return { error: (error as Error).message };
//     }
//   },
// });
