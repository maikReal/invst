import { ConnectedWallet } from "@privy-io/react-auth";

export const useExecuteStrategy = ({ wallet }: { wallet: ConnectedWallet }) => {
  // 1. Send tokens to Agent wallet
  // 2. Execute strategy
  // 3. Update UI

  const getWalletProvider = async () => {
    const provider = await wallet.getEthereumProvider();
  };
};
