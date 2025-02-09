# **_Invst_**

Invst is a user-friendly platform designed for individuals with little to no experience in cryptocurrency or decentralized finance (DeFi) to explore and invest using customized strategies. The platform simplifies the process by allowing users to create accounts via email, automatically generating a crypto wallet, and delegating funds to investment strategies that match their risk tolerance.

## **_Key features_**

- User-Friendly Onboarding: Sign up using your email, and a crypto wallet is automatically created
- Seamless Funding: Easily top up your wallet using services like Coinbase Onramp
- Personalized Investment Strategies: Choose from high, medium, or low-risk investment strategies
- Automated Portfolio Management: The platform’s AI agent manages your investments to maximize returns
- Security: Private keys and sensitive data are encrypted using the Lit Protocol, ensuring only the AI agent can access necessary information

## **_How it works?_**

1. Account Creation: Users sign up with their email, and a crypto wallet is generated
2. Funding: They fund this wallet via Coinbase or other onramp services
3. Strategy Selection: Users choose an investment strategy based on their risk preference (high, medium, low)
4. AI Management: The AI agent manages investments, optimizing for returns based on selected strategies
5. Monitoring and Rebalancing: The AI agent continuously monitors investments and rebalances them to align with user goals

## **_Integrated services_**

| Partner/Protocol                                                                       | Description                                                                                        | Usage in Product                                                                          |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **[Privy](https://privy.io)**                                                          | A service used for user authentication and embedded wallet creation based on email                 | Used for user onboarding and wallet creation                                              |
| **[Coinbase Developers Platform](https://docs.cdp.coinbase.com/cdp-sdk/docs/welcome)** | Coinbase Development Platform service for integrating an on-ramp solution                          | Allows users to top up their balance seamlessly                                           |
| **[Lit Protocol](https://www.litprotocol.com/)**                                       | A protocol used to encrypt and store sensitive data securely                                       | Encrypts information about newly created user wallets for agent usage                     |
| **[GAME Virtuals Framework](https://docs.game.virtuals.io/game-overview)**             | AI agent framework that acts as a manager to interact with users, receive input, and execute tasks | Manages user interactions and executes investment strategies                              |
| **[Agent Kit](https://docs.cdp.coinbase.com/agentkit/docs/welcome)**                   | Executors that work alongside the Game Virtuals Framework agent to perform various tasks           | Executes tasks such as interacting with protocols, handling tokens, and purchasing assets |
| **[The Graph Protocol](https://thegraph.com)**                                         | A decentralized protocol for indexing and querying blockchain data                                 | Used to fetch details about liquidity pools and other data from the Balancer protocol     |

# **_Architecture_**

The high level architecture of the service look like the following one
![schema](https://i.ibb.co/23BGbWmH/Invst-Schema.jpg "Architecture schema")

# **_Run service_**

The service is a monorepo and mabaged by Turbo. High-level parts are:

- **UI**
  - Next.js project with basic authentiication via Privy and strategies execution
- **Backend**
  - Admin agent that is based on GAME Virtuals protocol and executor that is based on Coinbase AgentKit

| **You can launch the full project at once or every module seaprately. All commands are work the same, just move to a necessary folder**

## **_Run locally_**

1. Install dependencies for a service or a module

```bash
  bun install
```

2. Run a service or a module

```bash
  bun run dev
```

## **_Deploy on Vercel_**

1. Set a correct **`vercel.json`** file

```json
{
  "buildCommand": "turbo run build",
  "outputDirectory": "ui/.next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/"
    }
  ]
}
```

2. Set a correct **`turbo.json`** file

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"],
      "env": [
        "CDP_API_KEY_NAME",
        "CDP_API_KEY_PRIVATE_KEY",
        "NEXT_PUBLIC_*",
        "LIT_NETWORK_ID",
        "WALLET_PROVIDER_NETWORK_ID",
        "ONE_INCH_API_KEY",
        "RPC_PROVIDER_URL",
        "ETHEREUM_PRIVATE_KEY"
      ]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true,
      "env": [
        "CDP_API_KEY_NAME",
        "CDP_API_KEY_PRIVATE_KEY",
        "NEXT_PUBLIC_*",
        "LIT_NETWORK_ID",
        "WALLET_PROVIDER_NETWORK_ID",
        "ONE_INCH_API_KEY",
        "RPC_PROVIDER_URL",
        "ETHEREUM_PRIVATE_KEY"
      ]
    }
  }
}
```

3. Deploy on Vercel

```bash
vercel deploy
```

## **_Environment variables_**

| Environment Variable                   | Description                                                                              | Example Value                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| **CDP_API_KEY_NAME**                   | The name identifier for the API key used in Coinbase Development Platform (CDP)          | `my-cdp-api-key`                          |
| **CDP_API_KEY_PRIVATE_KEY**            | The private key associated with the CDP API key for authentication and secure access     | `0xabc123def456...`                       |
| **LIT_NETWORK_ID**                     | Identifier for the Lit Protocol network used for encryption and decryption operations    | `baseSepolia`                             |
| **WALLET_PROVIDER_NETWORK_ID**         | The network ID of the blockchain used for wallet interactions and transactions           | `base-sepolia`                            |
| **ONE_INCH_API_KEY**                   | API key for interacting with the 1inch decentralized exchange aggregator                 | `1inch-abcdef-123456`                     |
| **RPC_PROVIDER_URL**                   | URL of the RPC provider used to interact with blockchain networks                        | `https://base-sepolia-rpc.publicnode.com` |
| **ETHEREUM_PRIVATE_KEY**               | Private key for signing transactions on the Ethereum network (should be securely stored) | `0x123abc456def789ghi`                    |
| **NEXT_PUBLIC_CDP_PROJECT_ID**         | Public identifier for the CDP (Coinbase Development Platform) project                    | `cdp-project-xyz123`                      |
| **NEXT_PUBLIC_PRIVY_APP_ID**           | Public ID for the Privy authentication app used for wallet login                         | `privy-app-abcdef`                        |
| **NEXT_PUBLIC_PRIVY_APP_SECRET**       | Secret key for Privy authentication (should be securely stored)                          | `super-secret-key-123`                    |
| **NEXT_PUBLIC_ONCHAINKIT_API_KEY**     | API key for OnchainKit, used for blockchain interactions                                 | `onchainkit-api-xyz789`                   |
| **NEXT_PUBLIC_ONCHAINKIT_PRIVATE_KEY** | Private key for OnchainKit API (should be securely stored)                               | `0xprivatekey123456789`                   |
