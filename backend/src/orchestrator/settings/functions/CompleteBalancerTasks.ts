import { GameFunction } from "@virtuals-protocol/game";

import {
  ExecutableGameFunctionStatus,
  ExecutableGameFunctionResponse,
} from "@virtuals-protocol/game";
import AgentKitService from "src/executor/AgentKitService";

/**
 * Createa an agent wallet per user
 *
 */
export const askToManageBalancerLiquidityFunction = new GameFunction({
  name: "ask_to_manage_balancer_liquidity",
  description:
    "Ask another AI agent to manage balancer liquidity for a provided user, chain id, and Balancer pools filters. Prints logs of actions and errors.",
  args: [
    {
      name: "userHashedEmail",
      type: "string",
      description: "The user's email address hashed with SHA256",
    },
    {
      name: "chainId",
      type: "number",
      description: "The chain ID to fetch pools from",
    },
    {
      name: "poolFilters",
      type: "object",
      optional: true,
      description: "The filters for selecting pools",
      properties: {
        apr: {
          type: "object",
          optional: true,
          properties: {
            min: { type: "number", optional: true },
            max: { type: "number", optional: true },
          },
        },
        totalSwapVolume: {
          type: "object",
          optional: true,
          properties: {
            min: { type: "number", optional: true },
            max: { type: "number", optional: true },
          },
        },
        totalLiquidity: {
          type: "object",
          optional: true,
          properties: {
            min: { type: "number", optional: true },
            max: { type: "number", optional: true },
          },
        },
        poolType: {
          type: "object",
          optional: true,
          properties: {
            include: {
              type: "array",
              items: { type: "string" },
              optional: true,
            },
            exclude: {
              type: "array",
              items: { type: "string" },
              optional: true,
            },
          },
        },
      },
    },
  ] as const,

  executable: async (args, logger) => {
    try {
      if (!args.userHashedEmail) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to manage balancer liquidity. Hashed email is not provided"
        );
      }

      logger(
        `Retreiving or creating an agent wallet for user: ${args.userHashedEmail}`
      );
      const agentKitService = await AgentKitService.createInstance(
        args.userHashedEmail
      );

      logger(`Agent wallet created for user: ${args.userHashedEmail}`);
      //   const userAgent = agentKitService.getAgentKitInstance();

      logger(`Asking a request to the agent...`);
      const result = await agentKitService.askRequest({
        chainId: 1,
        totalLiquidityMin: 1_000_000,
        aprMin: 5,
        tokenAmounts: {
          "0xTokenA": "1000",
          "0xTokenB": "1000",
        },
      });

      logger(`Agent processed the request. Pools output: ${result}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(result) || "No result"
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to create agent wallet"
      );
    }
  },
});
