import { useEffect, useState } from "react";
import axios from "axios";

/**
 * 📌 Custom hook to wait for agent response via polling
 * @param workerId - ID of the agent worker
 * @param pollingInterval - Polling frequency in ms (default: 3000)
 * @param timeout - Max wait time before stopping (default: 30s)
 */
export const useWaitForAgentResponse = (
  workerId: string,
  pollingInterval = 3000,
  timeout = 30000
) => {
  const [agentResponse, setAgentResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workerId) return;

    let elapsedTime = 0;
    const pollAgentResponse = async () => {
      try {
        const response = await axios.get(`/api/webhook?workerId=${workerId}`);

        if (response.data.success) {
          setAgentResponse(response.data.agentResponse);
          setLoading(false);
          clearInterval(interval); // ✅ Stop polling once we get a response
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          setError(err.message || "Failed to get response");
          setLoading(false);
          clearInterval(interval);
        }
      }
    };

    const interval = setInterval(() => {
      elapsedTime += pollingInterval;
      if (elapsedTime >= timeout) {
        clearInterval(interval);
        setLoading(false);
        setError("Timed out waiting for agent response.");
      }
      pollAgentResponse();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [workerId]);

  return { agentResponse, loading, error };
};
