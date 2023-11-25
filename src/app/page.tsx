'use client';

import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Spin } from 'antd';
import { GET_ACTIVE_ITEM } from '@/api';
import NftCard from '@/components/nft-card';
import { Web3WalletContext } from './provider';
import { NftInterface } from '@/types';

export default function Home() {
  const { isConnected } = useContext(Web3WalletContext);
  const { data, loading } = useQuery(GET_ACTIVE_ITEM);
  if (!isConnected) {
    return <div>Not connected to wallet...</div>;
  }
  if (loading)
    return (
      <div>
        <Spin size='large' />
      </div>
    );

  return (
    <div>
      <h1 className='font-bold text-2xl'>Recently Listed</h1>
      <div className='flex flex-wrap'>
        {data?.activeItems.map((nftItem: NftInterface, index: number) => (
          <div key={index} className='p-4 w-3/12'>
            <NftCard key={index} nftInfo={nftItem} />
          </div>
        ))}
      </div>
    </div>
  );
}
