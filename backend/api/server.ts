import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Agent } from "src/agent/agent";
import { agentHealthCheck } from "api/routes/agent/health";
import { executeStrategy } from "api/routes/agent/executeStrategy";
import { executeTaskByWorkerId } from "./routes/agent/executeTaskByWorkerId";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Start the agent when the server starts
const agent = Agent.getInstance();
agent
  .runAgent()
  .then(() => {
    console.log("Game Agent started successfully.");
  })
  .catch((error: any) => {
    console.error("Error starting Game Agent:", error);
  });

// API Endpoints
app.get("/", (req: any, res: any) => {
  res.json({ message: "Backend is running!", agentStatus: "Active" });
});

app.get("/api/agent/health", agentHealthCheck);

app.post("/api/agent/execute-strategy", executeStrategy);

app.post("/api/agent/worker/:workerId", executeTaskByWorkerId);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
