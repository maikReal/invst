import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomFundButton } from "@/components/ui/coinbase/buy";

export const AccountInfo = () => {
  const { user, authenticated, logout } = usePrivy();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [brightness, setBrightness] = useState("50%");

  useEffect(() => {
    if (user) {
      const smartWalletAddress = user?.linkedAccounts.find(
        (account) => account.type === "wallet"
      );

      user?.linkedAccounts.map((account) => {
        console.log(account);
      });
      smartWalletAddress?.address;
      setAddress(smartWalletAddress?.address);
    }

    if (!authenticated) {
      router.push("/auth");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <Flex flexDir={"column"} alignItems={"center"} gap={"1rem"}>
      <Heading size={"4xl"} fontWeight={"semibold"}>
        $0
      </Heading>

      {address && (
        <Flex gap={"1rem"} alignItems={"center"}>
          <Heading size={"md"} color={"gray.500"} fontWeight={"normal"}>
            {`${address?.substring(0, 4)}...${address?.substring(
              address.length - 4
            )}`}
          </Heading>
          <img
            width={"15px"}
            src="/disconnect-icon-white.png"
            onClick={handleLogout}
            style={{
              filter: `brightness(${brightness})`,
              transition: "filter 0.3s ease-in-out",
            }}
            onMouseEnter={() => {
              setBrightness("100%");
            }}
            onMouseLeave={() => {
              setBrightness("50%");
            }}
          />
        </Flex>
      )}
      <CustomFundButton />
    </Flex>
  );
};
