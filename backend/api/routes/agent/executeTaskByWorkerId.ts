import { Agent } from "src/orchestrator/agent";

export const executeTaskByWorkerId = async (req: any, res: any) => {
  const { workerId } = req.params;
  const { userHashedEmail } = req.body;
  const agentInstance = Agent.getInstance();
  if (!userHashedEmail) {
    return res.status(400).json({ error: "Hashed email is required" });
  }

  console.log("Input params: ", { workerId, userHashedEmail });

  try {
    const task = `Run the ${workerId} work with following input data: ${JSON.stringify(
      { userHashedEmail }
    )}`;

    console.log("Worker task: ", task);

    const result = await agentInstance.executeTaskByWorkerId({
      workerId,
      task,
    });

    console.log("Result: ", result);
    res.json({
      success: true,
      message: `Task ${workerId} executed successfully`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: `Error executing strategy: ${error}` });
  }
};
