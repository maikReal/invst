import { useState } from "react";
import { ethers } from "ethers";
import { ConnectedWallet } from "@privy-io/react-auth";
import { erc20Abi } from "viem"; // Import ERC-20 ABI

export const useSendMoneyToAgent = (wallet: ConnectedWallet) => {
  const USDT_CONTRACT = "0x5DEaC602762362FE5f135Fa5904351916053cF70"; // USDT contract on Base Sepolia

  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendTransaction = async ({
    to,
    amount,
  }: {
    to: string;
    amount: string; // Amount in USDT (e.g., "1" for 1 USDT)
  }) => {
    try {
      setIsSending(true);
      setTransactionHash(null);
      setError(null);

      const provider = new ethers.providers.Web3Provider(
        await wallet.getEthereumProvider()
      );
      const signer = provider.getSigner();

      const usdtContract = new ethers.Contract(USDT_CONTRACT, erc20Abi, signer);

      // Get USDT decimals (USDT uses 6 decimals)
      const decimals = await usdtContract.decimals();
      const amountInSmallestUnit = ethers.utils.parseUnits(amount, decimals); // Convert amount

      const tx = await usdtContract.transfer(to, amountInSmallestUnit);

      console.log(`🔄 Waiting for USDT transaction confirmation: ${tx.hash}`);
      await tx.wait();

      setTransactionHash(tx.hash);
      console.log(`✅ USDT Transaction confirmed: ${tx.hash}`);
    } catch (err: any) {
      setError(err.message);
      console.error("❌ USDT Transaction failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  return { sendTransaction, isSending, transactionHash, error };
};
