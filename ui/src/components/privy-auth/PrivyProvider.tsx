"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error("PRIVY_APP_ID is not set");
}

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export default function PrivyAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://your-logo-url",
        },
        // fundingMethodConfig: {
        //   moonpay: {
        //     paymentMethod: "credit_debit_card", // Purchase with credit or debit card
        //     uiConfig: { accentColor: "#696FFD", theme: "light" }, // Styling preferences for MoonPay's UIs
        //   },
        // },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "all-users", // Ensures wallets are created if the user doesn't have one
        },
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: "smartWalletOnly",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
