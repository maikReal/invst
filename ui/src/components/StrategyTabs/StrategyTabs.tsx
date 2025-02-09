import { Button, Flex, Input, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import {
  aprOptions,
  minTvlOptions,
  liquidityOptions,
  poolTypeOptions,
} from "./StrategyOptions";
import { StrategyCard } from "@/components/StrategyTabs/StrategyCard";

export const StrategyTabs = () => {
  const [apr, setApr] = useState(aprOptions[0]);
  const [minTvl, setMinTvl] = useState(minTvlOptions[0]);
  const [liquidity, setLiquidity] = useState(liquidityOptions[0]);
  const [poolType, setPoolType] = useState(poolTypeOptions[0]);

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
          <Input placeholder="Amount to invest" w={"20%"} />
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
            value={apr}
            onChange={setApr}
            placeholder="Select APR"
            selectLabel="Expected APR"
          />
          <StrategyCard
            title="Minimum TVL"
            description="Set the minimum Total Value Locked."
            options={minTvlOptions}
            value={minTvl}
            onChange={setMinTvl}
            placeholder="Select Minimum TVL"
            selectLabel="Minimum TVL"
          />
          <StrategyCard
            title="Liquidity"
            description="Select the minimum liquidity required."
            options={liquidityOptions}
            value={liquidity}
            onChange={setLiquidity}
            placeholder="Select Liquidity"
            selectLabel="Liquidity"
          />
          <StrategyCard
            title="Pool Type"
            description="Choose the pool type to invest in."
            options={poolTypeOptions}
            value={poolType}
            onChange={setPoolType}
            placeholder="Select Pool Type"
            selectLabel="Pool Type"
          />
        </Flex>
        <Button fontWeight={"bold"} size="xl" w={"50%"}>
          Execute Strategy
        </Button>
      </Tabs.Content>
    </Tabs.Root>
  );
};
