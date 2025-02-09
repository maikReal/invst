/**
 * 📌 Function to poll data from an endpoint until a response is received or timeout is reached.
 * @param url - The API endpoint to poll
 * @param options - Fetch options (optional)
 * @param pollingInterval - Polling frequency in ms (default: 3000)
 * @param timeout - Max wait time before stopping (default: 30s)
 * @returns The fetched data or an error message
 */
export const pollData = async <T>(
  url: string,
  options?: RequestInit,
  pollingInterval = 3000,
  timeout = 30000
): Promise<T | null> => {
  let elapsedTime = 0;

  while (elapsedTime < timeout) {
    try {
      console.log(`Polling: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (!response.ok) {
        if (response.status !== 404) {
          throw new Error(`Error: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        console.log("✅ Data received:", data);
        if (!response.ok) {
          if (response.status !== 404) {
            throw new Error(`Error: ${response.statusText}`);
          }
          return null;
        }

        return data.agentResponse;
      }
    } catch (error) {
      console.error("❌ Polling error:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    elapsedTime += pollingInterval;
  }

  console.error("❌ Polling timeout reached.");
  return null;
};
