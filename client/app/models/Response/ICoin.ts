export default interface ICoin {
  id: number;
  slug: string;
  symbol: string;
  name: string;
  type: string;
  category: string;
  rank: number;
  volume24hBase: number;
  values: {
    USD: {
      price: number;
      marketCap: number;
      volume24h: number;
      high24h: number;
      low24h: number;
      percentChange24h: number;
      percentChange7d: number;
      percentChange30d: number;
      percentChange3m: number;
      percentChange6m: number;
    };
    BTC: {
      price: number;
      marketCap: number;
      volume24h: number;
      high24h: number;
      low24h: number;
      percentChange24h: number;
      percentChange7d: number;
      percentChange30d: number;
      percentChange3m: number;
      percentChange6m: number;
    };
    ETH: {
      price: number;
      marketCap: number;
      volume24h: number;
      high24h: number;
      low24h: number;
      percentChange24h: number;
      percentChange7d: number;
      percentChange30d: number;
      percentChange3m: number;
      percentChange6m: number;
    };
  };
  tokens: [
    {
      tokenAddress: string;
      platform: {
        id: number;
        slug: string;
        name: string;
      };
    }
  ];
  links: [
    {
      type: string;
      value: string;
    }
  ];
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  lastUpdated: string;
  images: {
    '16x16': string;
    '200x200': string;
    '60x60': string;
  };
}
  