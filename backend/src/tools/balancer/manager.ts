import { GraphQLClient } from "graphql-request";
import { graphQlChainMapper } from "./settings";

export interface PoolFilters {
  apr?: any;
  minTvl?: number;
  poolType?: PoolTypes;
  liquidity?: number;
}

type PoolTypes =
  | "COMPOSABLE_STABLE"
  | "COW_AMM"
  | "ELEMENT"
  | "FX"
  | "GYRO"
  | "GYRO3"
  | "GYROE"
  | "INVESTMENT"
  | "LIQUIDITY_BOOTSTRAPPING"
  | "META_STABLE"
  | "PHANTOM_STABLE"
  | "STABLE"
  | "UNKNOWN"
  | "WEIGHTED";

export class BalancerManager {
  // https://docs.balancer.fi/data-and-analytics/data-and-analytics/subgraph.html
  private balancerClient: GraphQLClient;

  constructor() {
    this.balancerClient = new GraphQLClient("https://api-v3.balancer.fi/");
  }

  async getPools(chainId: number, filters: PoolFilters) {
    const chainName =
      graphQlChainMapper[chainId.toString() as keyof typeof graphQlChainMapper];

    const query = `
      {
        poolGetPools(where: {chainIn: [${chainName}], minTvl: ${
      filters.minTvl ?? 10000
    }, poolTypeIn:[${filters.poolType ?? "STABLE"}]) {
          dynamicData {
      totalLiquidity
    }
    staking {
      gauge {
        gaugeAddress
      }
    }
        }
      }
    `;

    console.log("🔹 Balancer GraphQL Query: ", query);

    const poolsInfo: { data: { poolGetPools: any[] } } =
      await this.balancerClient.request(query);

    const filteredPools = this.applyFilters(
      poolsInfo.data.poolGetPools,
      filters
    );

    console.log(`🔹 The list of filtered pools: ${filteredPools}`);

    return filteredPools;
  }

  private applyFilters(pools: any[], filters: PoolFilters) {
    // TODO: Add apr filter
    return pools.filter((pool) => {
      // Filter by totalLiquidity (converted to number)
      if (
        filters.liquidity !== undefined &&
        parseFloat(pool.dynamicData.totalLiquidity) < filters.liquidity
      ) {
        return false;
      }

      return true;
    });
  }
}
