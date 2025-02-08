import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomFundButton } from "@/components/ui/coinbase/buy";
import {
  ClipboardButton,
  ClipboardIconButton,
  ClipboardRoot,
} from "@/components/ui/clipboard";
import { useUsdcBalance } from "@/hooks/useBalance";

export const AccountInfo = () => {
  const { user, authenticated, logout } = usePrivy();
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const router = useRouter();
  const [brightness, setBrightness] = useState("100%");
  const { balance: usdcBalance } = useUsdcBalance(address);

  useEffect(() => {
    if (user) {
      const walletAddress = user?.linkedAccounts.find(
        (account) => account.type === "wallet"
      );

      user?.linkedAccounts.map((account) => {
        console.log(account);
      });
      walletAddress?.address;
      setAddress(walletAddress?.address as `0x${string}`);
    }

    if (user && !authenticated) {
      router.push("/auth");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  console.log(usdcBalance);
  return (
    <Flex flexDir={"column"} alignItems={"center"} gap={"1rem"}>
      <Heading size={"4xl"} fontWeight={"semibold"}>
        {usdcBalance !== null && !isNaN(usdcBalance) ? (
          `$${usdcBalance.toFixed(2)}`
        ) : (
          <Spinner />
        )}
      </Heading>

      {address && (
        <Flex gap={"1rem"} alignItems={"center"}>
          <Heading size={"md"} color={"gray.500"} fontWeight={"normal"}>
            <a onClick={() => navigator.clipboard.writeText(address || "")}>
              {`${address?.substring(0, 4)}...${address?.substring(
                address.length - 4
              )}`}
            </a>
          </Heading>
          <ClipboardRoot backgroundColor={"transparent"} value={address}>
            <ClipboardIconButton aria-label="Copy Address" variant={"ghost"} />
          </ClipboardRoot>
          <img
            width={"15px"}
            src="/disconnect-icon-white.png"
            onClick={handleLogout}
            style={{
              filter: `brightness(${brightness})`,
              transition: "filter 0.3s ease-in-out",
            }}
            onMouseEnter={() => {
              setBrightness("50%");
            }}
            onMouseLeave={() => {
              setBrightness("100%");
            }}
          />
        </Flex>
      )}
      <CustomFundButton />
    </Flex>
  );
};
