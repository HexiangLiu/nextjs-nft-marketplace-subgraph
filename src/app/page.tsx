'use client';

import { useState, useContext, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import { useQuery } from '@apollo/client';
import { Spin } from 'antd';
import { GET_ACTIVE_ITEM } from '@/api';
import NftCard from '@/components/nft-card';
import contractAddress from '@/constants/contractAddress.json';
import contractAbi from '@/constants/abi.json';
import { Web3WalletContext } from './provider';
import { NftInterface, TokenMetaData, NftCardProps } from '@/types';
import useRefetchData from '@/hooks/useRefetchData';

export default function Home() {
  const [nftList, setNftList] = useState<NftCardProps[]>([]);
  const { isConnected, signer, chainId } = useContext(Web3WalletContext);
  const { data, loading, refetch } = useQuery(GET_ACTIVE_ITEM, {});
  useRefetchData(refetch);

  const initNFTList = async () => {
    const BasicNft = new ethers.Contract(
      //@ts-ignore
      contractAddress[chainId]?.basicNFTAddress,
      contractAbi.basicNFTAbi,
      signer
    );
    const req: any[] = [];
    data?.activeItems.forEach((nftItem: NftInterface) => {
      req.push(getNftPros(BasicNft, nftItem));
    });
    const nftList = await Promise.all(req);
    setNftList(nftList);
  };

  const getNftPros = async (contract: Contract, nftItem: NftInterface) => {
    const tokenURI: string = await contract.tokenURI(nftItem.tokenId);
    if (tokenURI) {
      const tokenURIRes: TokenMetaData = await (
        await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'))
      ).json();
      tokenURIRes.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      return { ...tokenURIRes, ...nftItem };
    }
  };

  useEffect(() => {
    if (isConnected && data) {
      initNFTList();
    }
  }, [isConnected, data]);

  if (!isConnected) {
    return <div>Not connected to wallet...</div>;
  }
  if (loading) {
    return (
      <div>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div>
      <h1 className='font-bold text-2xl'>Recently Listed</h1>
      <div className='flex flex-wrap'>
        {nftList?.map((nftItem: NftCardProps, index: number) => (
          <div key={index} className='p-4 w-3/12'>
            <NftCard key={index} nftInfo={nftItem} />
          </div>
        ))}
      </div>
    </div>
  );
}
