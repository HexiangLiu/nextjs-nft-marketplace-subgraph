'use client';

import { useContext, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useQuery } from '@apollo/client';
import { GET_USER_ACTIVE_ITEM } from '@/api';
import { NftCardProps, NftInterface } from '@/types';
import NftCard from '@/components/nft-card';
import { Alchemy, Network, OwnedNft } from 'alchemy-sdk';
import { Web3WalletContext } from '../provider';
import useRefetchData from '@/hooks/useRefetchData';

// Setup: npm install alchemy-sdk

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

const SellPage = () => {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const { address } = useContext(Web3WalletContext);
  const { data, loading, refetch } = useQuery(GET_USER_ACTIVE_ITEM, {
    variables: {
      owner: address,
    },
  });
  useRefetchData(refetch);

  useEffect(() => {
    if (address) {
      getUserOwnedNfts();
    }
  }, [address]);

  const getUserOwnedNfts = async () => {
    const { ownedNfts } = await alchemy.nft.getNftsForOwner(address!);
    setNfts(ownedNfts);
  };

  const getNftInfo = (): NftCardProps[] => {
    return nfts.map((nft) => {
      const {
        contract,
        tokenId,
        raw: { metadata },
      } = nft;
      const listedNft: NftInterface | {} =
        data?.activeItems.find(
          (listedNft: NftInterface) =>
            listedNft.nftAddress.toLowerCase() ===
              contract.address.toLowerCase() && listedNft.tokenId === tokenId
        ) || {};
      return {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        price: undefined,
        nftAddress: contract.address,
        tokenId: tokenId,
        seller: address?.toLowerCase(),
        buyer: undefined,
        ...listedNft,
      };
    });
  };

  if (loading)
    return (
      <div>
        <Spin size='large' />
      </div>
    );
  return (
    <div>
      <h1 className='font-bold text-2xl'>Your NFTs</h1>
      <div className='flex flex-wrap'>
        {getNftInfo().map((nftItem: NftCardProps, index: number) => (
          <div key={index} className='p-4 w-3/12'>
            <NftCard key={index} nftInfo={nftItem} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellPage;
