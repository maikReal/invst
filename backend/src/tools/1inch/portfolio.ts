import dotenv from "dotenv";

dotenv.config();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getCurrentValue(walletAddress: string, chainId: number) {
  const endpoint = `https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${walletAddress}&chain_id=${chainId}`;
  const data = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}` },
  }).then((res) => res.json());
  return data;
}
