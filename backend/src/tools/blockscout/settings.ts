interface ChainsMapping {
  [key: string]: {
    name: string;
    hostname: string;
  };
}

export const chains: ChainsMapping = {
  "8453": {
    name: "Base",
    hostname: "https://base.blockscout.com",
  },
  "1": {
    name: "Ethereum",
    hostname: "https://eth.blockscout.com",
  },
};
