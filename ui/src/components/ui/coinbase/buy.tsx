"use client";

import { usePrivy } from "@privy-io/react-auth";

import { FundButton, getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

export function CustomFundButton() {
  const { user } = usePrivy();
  const smartWallet = user?.linkedAccounts.find(
    (account) => account.type === "wallet"
  );

  const [buyUrl, setBuyUrl] = useState<string | null>(null);

  useEffect(() => {
    if (smartWallet) {
      const walletAddress = smartWallet?.address;
      const projectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID!;

      const url = getOnrampBuyUrl({
        projectId,
        addresses: { [walletAddress]: ["base"] },
        assets: ["USDC"],
        presetFiatAmount: 50,
        fiatCurrency: "USD",
      });

      setBuyUrl(url);
    }
  }, [smartWallet]);

  if (!user) return <Text>Loading...</Text>;

  return (
    <>
      {buyUrl && (
        <FundButton
          hideIcon={true}
          fundingUrl={buyUrl}
          className="fundButtonCustom"
          text={!user ? "Loading..." : "Top-up account"}
          disabled={!user}
        />
      )}
    </>
  );
}
