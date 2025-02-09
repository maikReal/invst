import { Container, Flex, Heading, Stack } from "@chakra-ui/react";
import { StrategyTabs } from "@/components/StrategyTabs/StrategyTabs";
import { AccountInfo } from "../AccountInfo/AccountInfo";

export const Dashboard = () => {
  return (
    <Flex
      direction="column"
      w={"full"}
      align="center"
      justify="start"
      minH="100vh"
    >
      <Stack gap={16} align="center">
        <AccountInfo />
        <StrategyTabs />
      </Stack>
    </Flex>
  );
};

export default Dashboard;
