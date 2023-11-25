import { Card, Typography, Skeleton } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useContext, useState } from 'react';
import { NftInterface } from '@/types';
import contractAbi from '@/constants/abi.json';
import contractAddress from '@/constants/contractAddress.json';
import { Web3WalletContext } from '@/app/provider';

const { Text } = Typography;

interface TokenInfo {
  name: string;
  description: string;
  image: string;
}

const NftCard: React.FC<{ nftInfo: NftInterface }> = ({ nftInfo }) => {
  const { price, seller, tokenId } = nftInfo;
  const { chainId, signer } = useContext(Web3WalletContext);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

  const initNFT = async () => {
    const BasicNft = new ethers.Contract(
      //@ts-ignore
      contractAddress[chainId]?.basicNFTAddress,
      contractAbi.basicNFTAbi,
      signer
    );
    console.log(tokenId);
    const tokenURI: string = await BasicNft.tokenURI(tokenId);
    if (tokenURI) {
      const tokenURIRes: TokenInfo = await (
        await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'))
      ).json();
      tokenURIRes.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      setTokenInfo(tokenURIRes);
    }
  };

  useEffect(() => {
    initNFT();
  }, [tokenId]);

  if (!tokenInfo) {
    return <Skeleton />;
  }

  return (
    <Card hoverable cover={<img alt='nft' src={tokenInfo.image} />}>
      <div>
        <div className='font-bold'>
          <Text
            ellipsis={{
              tooltip: tokenInfo.name,
            }}
          >
            {tokenInfo.name}
          </Text>
        </div>
        <div>{tokenInfo.description}</div>
      </div>
      <div className='flex justify-between'>
        <div className='flex flex-col w-1/2'>
          <div className='text-gray-500'>Price</div>
          <div className='font-bold'>
            {ethers.utils.formatEther(`${price}`).toString()} ETH
          </div>
        </div>
        <div className='flex flex-col w-1/2'>
          <div className='text-gray-500'>Owner</div>
          <Text
            ellipsis={{
              tooltip: seller,
            }}
            copyable
            className='font-bold'
          >
            {seller}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default NftCard;
