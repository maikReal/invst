"use client";

import { Flex, Heading, Button } from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";
import { FundAccount } from "@/components/ui/coinbase/buy";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const { user, logout } = usePrivy();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log(user);
      const smartWalletAddress = user?.linkedAccounts.find(
        (account) => account.type === "wallet"
      );

      user?.linkedAccounts.map((account) => {
        console.log(account);
      });
      smartWalletAddress?.address;
      setAddress(smartWalletAddress?.address);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <>
      {address && <Heading>{address}</Heading>}
      <Heading>$0</Heading>
      <FundAccount />
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
}
