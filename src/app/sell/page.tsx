'use client';

import { useContext, useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { Spin, Button, message } from 'antd';
import { useQuery } from '@apollo/client';
import { Alchemy, Network, OwnedNft } from 'alchemy-sdk';
import { GET_USER_ACTIVE_ITEM } from '@/api';
import { NftCardProps, NftInterface } from '@/types';
import NftCard from '@/components/nft-card';
import useRefetchData from '@/hooks/useRefetchData';
import contractAbi from '@/constants/abi.json';
import contractAddress from '@/constants/contractAddress.json';
import { Web3WalletContext } from '../provider';

// Setup: npm install alchemy-sdk

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

const SellPage = () => {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [proceeds, setProceeds] = useState<string>();
  const { address, signer, chainId } = useContext(Web3WalletContext);
  const [nftMarketPlace, setNftMarketPlace] = useState<Contract>();
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery(GET_USER_ACTIVE_ITEM, {
    variables: {
      owner: address,
    },
  });
  useRefetchData(refetch);

  useEffect(() => {
    if (address) {
      getUserOwnedNfts();
      getUserProceeds();
    }
  }, [address]);

  const getUserProceeds = async () => {
    const NftMarketPlace = new ethers.Contract(
      //@ts-ignore
      contractAddress[chainId]?.nftMarketplaceAddress,
      contractAbi.nftMarketplaceAbi,
      signer
    );
    setNftMarketPlace(NftMarketPlace);
    const proceeds = await NftMarketPlace.getProceeds(address);
    setProceeds(ethers.utils.formatEther(proceeds).toString());
  };

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

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      await nftMarketPlace?.withdrawProceeds();
      message.success('Withdraw successfully');
      setProceeds(undefined);
    } catch (e) {
      message.error('Withdraw failed...');
    }
    setWithdrawLoading(false);
  };

  if (loading)
    return (
      <div>
        <Spin size='large' />
      </div>
    );

  return (
    <div className='flex justify-between'>
      <div className='basis-3/4'>
        <h1 className='font-bold text-2xl'>Your NFTs</h1>
        <div className='flex flex-wrap'>
          {getNftInfo().map((nftItem: NftCardProps, index: number) => (
            <div key={index} className='p-4 w-3/12'>
              <NftCard key={index} nftInfo={nftItem} />
            </div>
          ))}
        </div>
      </div>
      <div className='basis-1/4'>
        <h1 className='font-bold text-2xl'>Withdraw Proceeds</h1>
        <div className='mb-2'>
          Your current proceeds is: {proceeds || 0} ETH
        </div>
        {proceeds ? (
          <Button
            size='large'
            type='primary'
            onClick={handleWithdraw}
            loading={withdrawLoading}
          >
            Withdraw
          </Button>
        ) : (
          <div>No proceeds detected</div>
        )}
      </div>
    </div>
  );
};

export default SellPage;
