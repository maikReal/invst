import { Agent } from "src/orchestrator/agent";

export const agentHealthCheck = (req: any, res: any) => {
  const agentInstance = Agent.getInstance();
  res.json({ status: "running", agent: agentInstance.getAgent() });
};
