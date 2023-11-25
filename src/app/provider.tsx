'use client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
console.log(projectId);

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL!,
};

const testnet = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
};

const localnet = {
  chainId: 31337,
  currency: 'GO',
  name: 'Hardhat',
  explorerUrl: '',
  rpcUrl: 'http://127.0.0.1:8545/',
};

// 3. Create modal
const metadata = {
  name: 'NFT Marketplace',
  description: 'NFT Marketplace',
  url: 'http://localhost:3000',
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet, testnet, localnet],
  projectId,
});

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/59300/nft-marketplace/version/latest',
  cache: new InMemoryCache(),
});

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;
