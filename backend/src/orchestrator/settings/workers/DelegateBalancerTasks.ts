import { GameWorker } from "@virtuals-protocol/game";
import { askToManageBalancerLiquidityFunction } from "src/orchestrator/settings/functions/CompleteBalancerTasks";

export const balancerWorker = new GameWorker({
  id: "balancer_worker",
  name: "BalancerWorker",
  description:
    "Fetches best pools by filters and adds liquidity if needed. Useful for low risk investments strategy",
  functions: [askToManageBalancerLiquidityFunction],
});
