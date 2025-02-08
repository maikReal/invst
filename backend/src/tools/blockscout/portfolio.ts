import { chains } from "./settings";

export const getPortfolio = async ({
  walletAddress,
  chainId = 1,
  types = ["ERC-20", "ERC-721", "ERC-1155"],
  needToFilterDust = true,
}: {
  walletAddress: string;
  chainId?: number;
  types?: string[];
  needToFilterDust?: boolean;
}) => {
  try {
    if (!chains[chainId.toString() as keyof typeof chains]) {
      throw new Error(`Invalid chainId: ${chainId}`);
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new Error(`Invalid Ethereum address: ${walletAddress}`);
    }

    const hostname = chains[chainId.toString() as keyof typeof chains].hostname;
    const baseEndpoint = `${hostname}/api/v2/addresses/${walletAddress}/tokens`;

    let endpoint = `${baseEndpoint}?type=${encodeURIComponent(
      types.join(",")
    )}`;
    let allTokens: any[] = [];
    let nextPageParams: Record<string, any> | null = null;

    while (endpoint) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();

        allTokens = allTokens.concat(data.items || []);

        nextPageParams = data.next_page_params;

        if (!nextPageParams) break;

        const nextParams = new URLSearchParams();
        Object.entries(nextPageParams).forEach(([key, value]) => {
          if (value !== null) nextParams.append(key, value.toString());
        });

        endpoint = `${baseEndpoint}?${nextParams.toString()}&type=${encodeURIComponent(
          types.join(",")
        )}`;
      } catch (error) {
        console.error(`❌ Error fetching data from ${endpoint}:`, error);
        break; // Stop fetching if an error occurs
      }
    }

    if (needToFilterDust) {
      allTokens = filterDust(allTokens);
    }

    return { walletAddress, chainId, tokens: allTokens };
  } catch (error) {
    console.error("❌ getPortfolio Error:", error);
    return { error: (error as Error).message };
  }
};

const filterDust = (tokens: any[]) => {
  return tokens.filter(({ token }) => {
    const marketCap = token?.circulating_market_cap;

    // Exclude tokens with `null` or `marketCap < 1,000,000`
    return marketCap !== null && parseFloat(marketCap) >= 1_000_000;
  });
};
