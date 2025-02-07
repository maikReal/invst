import { Agent } from "src/agent/agent";

export const executeStrategy = async (req: any, res: any) => {
  const { strategy } = req.body;
  const agentInstance = Agent.getInstance();
  if (!strategy) {
    return res.status(400).json({ error: "Strategy name is required" });
  }

  try {
    await agentInstance.executeStrategy(strategy);
    res.json({
      success: true,
      message: `Strategy ${strategy} executed successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: `Error executing strategy: ${error}` });
  }
};
