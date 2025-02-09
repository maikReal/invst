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
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/invst-logo.png",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "all-users",
          },
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
