import { Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import { StrategyTabs } from "@/components/StrategyTabs/StrategyTabs";
import { AccountInfo } from "../AccountInfo/AccountInfo";
import { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { ConnectedWallet } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export const Dashboard = () => {
  const { user, authenticated, logout } = usePrivy();

  const { wallets } = useWallets();
  const router = useRouter();
  const [mainWallet, setMainWallet] = useState<ConnectedWallet | undefined>();

  useEffect(() => {
    if (user && !authenticated) {
      router.push("/auth");
    }
  }, [user]);

  useEffect(() => {
    wallets.map((wallet) => {
      if (wallet.walletClientType == "privy") {
        setMainWallet(wallet);
      }
    });
  }, [wallets]);

  return (
    <Flex
      direction="column"
      w={"full"}
      align="center"
      justify="start"
      minH="100vh"
    >
      <Stack gap={16} align="center">
        {mainWallet ? (
          <>
            <AccountInfo address={mainWallet?.address as `0x${string}`} />
            <StrategyTabs userWallet={mainWallet} />
          </>
        ) : (
          <Flex flexDir="column" justify="center" align="center" gap={4}>
            <Spinner />
            <Heading>Warmup AI agents army for you...</Heading>
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

export default Dashboard;
