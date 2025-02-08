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
export const createOrRetreiveWalletFunction = new GameFunction({
  name: "create_or_retreive_agent_wallet",
  description:
    "Create or retreive a wallet based on a user hashed email to use for on-chain operations",
  args: [
    {
      name: "userHashedEmail",
      type: "string",
      description: "The user's email address hashed with SHA256",
    },
  ] as const,

  executable: async (args, logger) => {
    try {
      if (!args.userHashedEmail) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to create agent wallet. Hashed email is not provided"
        );
      }

      logger(`Creating agent wallet for user: ${args.userHashedEmail}`);
      const agentKitService = await AgentKitService.createInstance(
        args.userHashedEmail
      );

      logger(`Agent wallet created for user: ${args.userHashedEmail}`);

      const generatedWalletAddress = agentKitService.getAgentWalletAddress();

      logger(`Agent wallet address: ${generatedWalletAddress}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        generatedWalletAddress
      );
    } catch (e) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        "Failed to create agent wallet"
      );
    }
  },
});
