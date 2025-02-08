import { Agent } from "src/orchestrator/agent";

export const executeTaskByRequest = async (req: any, res: any) => {
  const { workerId } = req.params;
  const { task } = req.body;
  const agentInstance = Agent.getInstance();
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  console.log("Input params: ", { workerId, task });

  try {
    // const task = `Run the ${workerId} work with following input data: ${JSON.stringify(
    //   { userHashedEmail }
    // )}`;

    console.log("Worker task: ", task);

    await agentInstance.executeTaskByWorkerId({
      workerId,
      task,
    });
    res.json({
      success: true,
      message: `Task ${workerId} executed successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: `Error executing strategy: ${error}` });
  }
};
