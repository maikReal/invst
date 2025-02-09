import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";
import { erc20Abi } from "viem";

const USDC_CONTRACTS: Record<number, `0x${string}`> = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum Mainnet
  8453: "0xd9AA6cBe4F92F555619cA96F1896795f0f6d1b21", // Base Mainnet
  84532: "0x19B57F2Ee33bcFDE75c1496B3752D099fc408Ef1", // USDT on Base Sepolia as hard to find USDC on Base Sepolia
  //   84532: "0x5deac602762362fe5f135fa5904351916053cf70", // Base Sepolia Testnet
};

interface UseUsdcBalanceResult {
  balance: number | null;
  loading: boolean;
  error: string | null;
}

export function useUsdcBalance(
  walletAddress?: `0x${string}` | undefined,
  chainId = 84532
): UseUsdcBalanceResult {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) {
        setBalance(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const client = createPublicClient({
        chain: chainId === 84532 ? baseSepolia : base,
        transport: http(),
      });

      const usdcContract = USDC_CONTRACTS[chainId];

      if (!usdcContract) {
        setError(`Unsupported chain ID: ${chainId}`);
        setLoading(false);
        return;
      }

      try {
        const balanceRaw = await client.readContract({
          address: usdcContract,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [walletAddress],
        });

        const formattedBalance = parseFloat(balanceRaw.toString()) / 1e18; // 1e6 for USDC as it uses 6 decimals
        setBalance(formattedBalance);
      } catch (err) {
        setError(`Failed to fetch balance: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [walletAddress, chainId]);

  return { balance, loading, error };
}
