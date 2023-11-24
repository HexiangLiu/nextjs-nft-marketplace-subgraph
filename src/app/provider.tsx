'use client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import React, { ReactNode } from 'react';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/59300/nft-marketplace/version/latest',
  cache: new InMemoryCache(),
});

const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;
