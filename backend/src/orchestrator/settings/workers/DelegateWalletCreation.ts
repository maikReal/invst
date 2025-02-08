import { GameWorker } from "@virtuals-protocol/game";
import { createOrRetreiveWalletFunction } from "src/orchestrator/settings/functions/AgentKitCustomFunctions";

export const createOrRetreiveWalletWorker = new GameWorker({
  id: "create_or_retreive_wallet",
  name: "Create or retreive wallet",
  description:
    "Create or retreive a wallet based on a user hashed email to use for on-chain operations",
  functions: [createOrRetreiveWalletFunction],
});
