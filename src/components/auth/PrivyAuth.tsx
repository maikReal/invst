"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PRIVY_APP_ID) {
  throw new Error("PRIVY_APP_ID is not set");
}

const appId = process.env.PRIVY_APP_ID;

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
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
