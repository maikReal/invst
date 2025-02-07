"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

import { FundButton, getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { useState, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

export function FundAccount() {
  const { user } = usePrivy();
  const smartWallet = user?.linkedAccounts.find(
    (account) => account.type === "wallet"
  );

  //   const { wallets } = useSmartWallets();
  const [buyUrl, setBuyUrl] = useState<string | null>(null);

  useEffect(() => {
    if (smartWallet) {
      const walletAddress = smartWallet?.address;
      const projectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID!;

      const url = getOnrampBuyUrl({
        projectId,
        addresses: { [walletAddress]: ["base"] }, // Buy assets on Base chain
        assets: ["USDC"], // Default to USDC purchases
        presetFiatAmount: 50, // Example preset amount
        fiatCurrency: "USD",
      });

      setBuyUrl(url);
    }
  }, [smartWallet]);

  if (!user) return <Text>Loading...</Text>;
  //   if (!wallets.length) return <Text>No Smart Wallet found</Text>;

  console.log("buyUrl", buyUrl);
  return (
    <Box textAlign="center">
      <Text fontSize="lg" mb={4}>
        Fund your wallet with Coinbase Onramp
      </Text>
      {buyUrl && (
        <FundButton
          fundingUrl={buyUrl}
          text="Top-up"
          hideIcon={false}
          openIn="popup"
        />
      )}
    </Box>
  );
}
