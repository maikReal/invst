import { Button, Flex, Input, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  aprOptions,
  minTvlOptions,
  liquidityOptions,
  poolTypeOptions,
} from "./StrategyOptions";
import { StrategyCard } from "@/components/StrategyTabs/StrategyCard";
import { ConnectedWallet, usePrivy } from "@privy-io/react-auth";
import { useWaitForAgentResponse } from "@/hooks/useWaitForAgentResponse";
import { useAgentRequest } from "@/hooks/useAgentRequest";
import { hashEmail } from "@/lib/utils/hashEmail";
import { useSendMoneyToAgent } from "@/hooks/useSendMoneyToAgent";

export const StrategyTabs = ({
  userWallet,
}: {
  userWallet: ConnectedWallet;
}) => {
  //   const { user } = usePrivy();
  //   const [apr, setApr] = useState<string | undefined>(undefined);
  //   const [minTvl, setMinTvl] = useState<string | undefined>(undefined);
  //   const [liquidity, setLiquidity] = useState<string | undefined>(undefined);
  //   const [poolType, setPoolType] = useState<string | undefined>(undefined);
  //   const [investmentAmount, setInvestmentAmount] = useState<string | null>(null);
  //   const [fieldsAreFilled, setFieldsAreFilled] = useState(false);

  //   // Just ot show on UI
  //   const [executedSteps, setExecutedSteps] = useState<
  //     { step: number; task: string; response?: string }[]
  //   >([]);
  //   const [agentResponses, setAgentResponses] = useState<Record<string, any>>({});
  //   const [agentTasks, setAgentTasks] = useState<
  //     | {
  //         workerId: string;
  //         task: string;
  //       }[]
  //     | null
  //   >(null);

  //   const [currentStep, setCurrentStep] = useState(0);
  //   const [isRunning, setIsRunning] = useState(false);
  //   const [taskStatus, setTaskStatus] = useState<string>("Waiting to start...");

  //   const { executeTask, workerId } = useAgentRequest();
  //   const {
  //     agentResponse,
  //     loading: isWaiting,
  //     error: responseError,
  //   } = useWaitForAgentResponse(workerId || "");
  //   const { sendTransaction, isSending, transactionHash } =
  //     useSendMoneyToAgent(userWallet);

  //   const sendFundsToAgent = async (agentWallet: string) => {
  //     setTaskStatus("🔄 Sending funds to agent wallet...");

  //     try {
  //       await sendTransaction({
  //         to: agentWallet,
  //         amount: investmentAmount || "0.01",
  //       });

  //       console.log("✅ Funds sent successfully. Proceeding to next step...");
  //       setTimeout(() => {
  //         setCurrentStep((prev) => prev + 1);
  //         triggerWorker(1); // Move to Step 2
  //       }, 2000);
  //     } catch (err) {
  //       console.error("❌ Failed to send funds:", err);
  //       setTaskStatus("❌ Failed to send funds.");
  //       setIsRunning(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (user && fieldsAreFilled) {
  //       const hashedEmail = hashEmail(user?.email || "");

  //       const tasks = [
  //         {
  //           workerId: "create_or_retreive_wallet",
  //           task: `Create a wallet for user: ${hashedEmail}`,
  //         },
  //         // Between Step 1 and Step 2: send funds to agent
  //         {
  //           workerId: "balancer_worker",
  //           task: `Manage Balancer pools for a user with hashed email: ${hashedEmail} and the following filters:
  //           \n- chainId: 8453
  //           \n- APR: ${apr}
  //           \n- Minimum TVL: ${minTvl}
  //           \n- Liquidity: ${liquidity}
  //           \n- Pool Type: ${poolType}`,
  //         },
  //       ];

  //       setAgentTasks(tasks);
  //     }
  //   }, [user, fieldsAreFilled]);

  //   const handleStrategyExecution = () => {
  //     if (!fieldsAreFilled || !user || !agentTasks) return;

  //     setIsRunning(true);
  //     setTaskStatus("🚀 Starting strategy execution...");

  //     setCurrentStep(0);
  //     triggerWorker(0);
  //   };

  //   // Automatically trigger the next step when response is received
  // //   useEffect(() => {
  // //     if (!isRunning || !workerId || !agentTasks) return;

  // //     if (agentResponse && agentTasks) {
  // //       if (currentStep < agentTasks.length - 1) {
  // //         setTimeout(() => {
  // //           setCurrentStep((prev) => prev + 1);
  // //           triggerWorker(currentStep + 1);
  // //         }, 2000);
  // //       } else {
  // //         setTaskStatus("✅ All steps completed!");
  // //         setIsRunning(false);
  // //       }
  // //     }
  // //   }, [agentResponse]);

  //   const triggerWorker = async (stepIndex: number) => {
  //     if (!agentTasks) return;
  //     const { workerId, task } = agentTasks[stepIndex];
  //     setTaskStatus(`⏳ Running step ${stepIndex + 1}: ${task}...`);

  //     setExecutedSteps((prev) => [
  //       ...prev,
  //       { step: stepIndex + 1, task: task, response: "Waiting for response..." },
  //     ]);

  //     await executeTask(workerId, task);

  //     console.log(`⏳ Waiting for response from worker ${workerId}...`);
  //     while (isWaiting || !agentResponse) {
  //       await new Promise((resolve) => setTimeout(resolve, 3000));
  //     }

  //     console.log(`✅ Worker ${workerId} response received!`);

  //     // Save response for each worker separately
  //     setAgentResponses((prev) => ({
  //       ...prev,
  //       [workerId]: agentResponse,
  //     }));
  //     setExecutedSteps((prev) =>
  //       prev.map((s) =>
  //         s.step === stepIndex + 1 ? { ...s, response: agentResponse } : s
  //       )
  //     );

  //     setTaskStatus(`✅ Step ${stepIndex + 1} completed!`);
  //     if (stepIndex === 0) {
  //       console.log(
  //         `🔁 Executing transaction... Data from an agent: ${agentResponse}`
  //       );

  //       await sendFundsToAgent(agentResponse.data.walletAddress);
  //     }
  //   };

  const { user } = usePrivy();
  const [apr, setApr] = useState<string>();
  const [minTvl, setMinTvl] = useState<string>();
  const [liquidity, setLiquidity] = useState<string>();
  const [poolType, setPoolType] = useState<string>();
  const [investmentAmount, setInvestmentAmount] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [taskStatus, setTaskStatus] = useState<string>("Waiting to start...");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fieldsAreFilled, setFieldsAreFilled] = useState(false);

  const [agentTasks, setAgentTasks] = useState<
    { workerId: string; task: string }[] | null
  >(null);
  const [agentResponses, setAgentResponses] = useState<Record<string, any>>({});

  const { executeTask, workerId } = useAgentRequest();
  const { agentResponse, loading: isWaiting } = useWaitForAgentResponse(
    workerId || ""
  );
  const { sendTransaction, transactionHash } = useSendMoneyToAgent(userWallet);

  // **Initialize tasks when all fields are filled**
  useEffect(() => {
    if (fieldsAreFilled) {
      const hashedEmail = hashEmail(user?.email || "");
      setAgentTasks([
        {
          workerId: "create_or_retreive_wallet",
          task: `Create wallet for user: ${hashedEmail}`,
        },
        {
          workerId: "balancer_worker",
          task: `Manage Balancer pools for a user with hashed email: ${hashedEmail} and the following filters:
  //           \n- chainId: 8453
  //           \n- APR: ${apr}
  //           \n- Minimum TVL: ${minTvl}
  //           \n- Liquidity: ${liquidity}
  //           \n- Pool Type: ${poolType}`,
        },
      ]);
    }
  }, [user, fieldsAreFilled]);

  // **Trigger next step automatically**
  useEffect(() => {
    if (!isRunning || !agentTasks || currentStep >= agentTasks.length) return;

    if (currentStep === 1 && agentResponse) {
      sendFundsToAgent(agentResponse?.data?.walletAddress);
    } else if (currentStep > 1) {
      triggerWorker(currentStep);
    }
  }, [agentResponse]);

  // **Execute a worker step**
  const triggerWorker = async (stepIndex: number) => {
    if (!agentTasks) return;
    const { workerId, task } = agentTasks[stepIndex];

    setTaskStatus(`⏳ Running step ${stepIndex + 1}: ${task}...`);
    await executeTask(workerId, task);

    console.log(`⏳ Waiting for response from worker ${workerId}...`);
    while (isWaiting || !agentResponse)
      await new Promise((r) => setTimeout(r, 3000));

    console.log(`✅ Worker ${workerId} response received!`);
    setAgentResponses((prev) => ({ ...prev, [workerId]: agentResponse }));
    setTaskStatus(`✅ Step ${stepIndex + 1} completed!`);
    setCurrentStep((prev) => prev + 1);
  };

  // **Send funds to agent wallet**
  const sendFundsToAgent = async (agentWallet: string) => {
    setTaskStatus("🔄 Sending funds to agent wallet...");
    await sendTransaction({
      to: agentWallet,
      amount: investmentAmount || "0.1",
    });
    console.log("✅ Funds sent successfully. Proceeding to next step...");
    setCurrentStep((prev) => prev + 1);
  };

  // **Handle strategy execution**
  const handleStrategyExecution = () => {
    if (!agentTasks) return;
    setIsRunning(true);
    setTaskStatus("🚀 Starting strategy execution...");
    setCurrentStep(0);
    triggerWorker(0);
  };
  useEffect(() => {
    if (apr && minTvl && liquidity && poolType && investmentAmount) {
      setFieldsAreFilled(true);
    } else {
      setFieldsAreFilled(false);
    }
  }, [apr, minTvl, liquidity, poolType, investmentAmount]);

  return (
    <Tabs.Root
      defaultValue="low"
      variant={"plain"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Tabs.List gap={24} bg="bg.muted" rounded="l3" p="2">
        <Tabs.Trigger value="high">High risk</Tabs.Trigger>
        <Tabs.Trigger value="medium">Medium risk</Tabs.Trigger>
        <Tabs.Trigger value="low">Low risk</Tabs.Trigger>
        <Tabs.Indicator rounded="l2" p="2" />
      </Tabs.List>
      <Tabs.Content
        value="high"
        w={"full"}
        display={"flex"}
        justifyContent={"center"}
      >
        Coming soon
      </Tabs.Content>
      <Tabs.Content
        value="medium"
        w={"full"}
        display={"flex"}
        justifyContent={"center"}
      >
        Coming soon
      </Tabs.Content>
      <Tabs.Content
        value="low"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={12}
      >
        <Flex
          w={"full"}
          gap={16}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Input
            type="number"
            placeholder="Amount to invest"
            w={"20%"}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            onFocus={(e) => e.target.select()}
            onWheel={(e) => e.preventDefault()}
            css={{
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                display: "none",
              },
              "&[type=number]": {
                MozAppearance: "textfield",
              },
            }}
          />
          <Text>Previously invested: $5</Text>
        </Flex>

        <Flex
          w={"full"}
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={4}
        >
          <StrategyCard
            title="APR"
            description="Choose the expected APR for your investment."
            options={aprOptions}
            onChange={setApr}
            placeholder="Select APR"
            selectLabel="Expected APR"
          />
          <StrategyCard
            title="Minimum TVL"
            description="Set the minimum Total Value Locked."
            options={minTvlOptions}
            onChange={setMinTvl}
            placeholder="Select Minimum TVL"
            selectLabel="Minimum TVL"
          />
          <StrategyCard
            title="Liquidity"
            description="Select the minimum liquidity required."
            options={liquidityOptions}
            onChange={setLiquidity}
            placeholder="Select Liquidity"
            selectLabel="Liquidity"
          />
          <StrategyCard
            title="Pool Type"
            description="Choose the pool type to invest in."
            options={poolTypeOptions}
            onChange={setPoolType}
            placeholder="Select Pool Type"
            selectLabel="Pool Type"
          />
        </Flex>
        <Button
          fontWeight={"bold"}
          size="xl"
          w={"50%"}
          disabled={!fieldsAreFilled}
        >
          Execute Strategy
        </Button>

        <Text fontSize="lg" fontWeight="bold">
          {taskStatus}
        </Text>
        {transactionHash && (
          <Text color="blue.500">✅ Transaction: {transactionHash}</Text>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
};
