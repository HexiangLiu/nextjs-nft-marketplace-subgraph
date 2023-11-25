'use client';

import { useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useQuery } from '@apollo/client';
import { Spin } from 'antd';
import { GET_ACTIVE_ITEM } from '@/api';
import NftCard from '@/components/nft-card';
import contractAddress from '@/constants/contractAddress.json';
import contractAbi from '@/constants/abi.json';
import { Web3WalletContext } from './provider';
import { NftInterface } from '@/types';

export default function Home() {
  const { isConnected, signer, chainId } = useContext(Web3WalletContext);
  const { data, loading, refetch } = useQuery(GET_ACTIVE_ITEM, {});
  useEffect(() => {
    if (isConnected) {
      const NftMarketPlace = new ethers.Contract(
        //@ts-ignore
        contractAddress[chainId]?.nftMarketplaceAddress,
        contractAbi.nftMarketplaceAbi,
        signer
      );
      NftMarketPlace.on('ItemListed', () => {
        refetch();
      });
      NftMarketPlace.on('ItemCanceled', () => {
        refetch();
      });
      return () => {
        NftMarketPlace.removeAllListeners();
      };
    }
  }, [isConnected]);
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
