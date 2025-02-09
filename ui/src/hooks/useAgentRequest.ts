import { useState } from "react";
import axios from "axios";

export const useAgentRequest = () => {
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📌 Function to trigger agent execution
   * @param workerId - The ID of the worker
   * @param task - The task the agent needs to execute
   */
  const executeTask = async (workerId: string, task: string) => {
    setIsRequesting(true);
    setError(null);

    try {
      const response = await axios.post("/api/agent/ask-request/" + workerId, {
        task,
      });

      if (response.data.success) {
        setWorkerId(workerId);
      } else {
        throw new Error(response.data.error || "Failed to execute agent task");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsRequesting(false);
    }
  };

  return { executeTask, workerId, isRequesting, error };
};
