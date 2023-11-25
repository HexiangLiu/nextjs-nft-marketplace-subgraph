import { Card, Typography, Skeleton, Button, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Contract, ethers } from 'ethers';
import { useEffect, useContext, useState } from 'react';
import { NftInterface } from '@/types';
import contractAbi from '@/constants/abi.json';
import contractAddress from '@/constants/contractAddress.json';
import { Web3WalletContext } from '@/app/provider';
import UpdateModal from './update-list-modal';

const { Text } = Typography;

interface TokenInfo {
  name: string;
  description: string;
  image: string;
}

const NftCard: React.FC<{ nftInfo: NftInterface }> = ({ nftInfo }) => {
  const { price, seller, tokenId, nftAddress, buyer } = nftInfo;
  const { chainId, signer, address } = useContext(Web3WalletContext);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [nftMarketPlace, setNftMarketPlace] = useState<Contract>();
  const isOwner = seller === address?.toLowerCase();
  const expired = buyer !== '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    initNFT();
  }, [tokenId]);

  const initNFT = async () => {
    const BasicNft = new ethers.Contract(
      //@ts-ignore
      contractAddress[chainId]?.basicNFTAddress,
      contractAbi.basicNFTAbi,
      signer
    );
    const NftMarketPlace = new ethers.Contract(
      //@ts-ignore
      contractAddress[chainId]?.nftMarketplaceAddress,
      contractAbi.nftMarketplaceAbi,
      signer
    );
    setNftMarketPlace(NftMarketPlace);
    const tokenURI: string = await BasicNft.tokenURI(tokenId);
    if (tokenURI) {
      const tokenURIRes: TokenInfo = await (
        await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'))
      ).json();
      tokenURIRes.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      setTokenInfo(tokenURIRes);
    }
  };

  const handleShowUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCancelItem = () => {
    Modal.confirm({
      title: 'Are you sure to cancel the listing?',
      onOk: async () => {
        try {
          await nftMarketPlace?.cancelListing(nftAddress, tokenId);
          message.success('Cancel Listing Successfully!');
        } catch (e) {
          message.error('Cancel Listing Failed...');
        }
      },
      okButtonProps: {
        danger: true,
      },
    });
  };

  const handleUpdateItem = async (price: number) => {
    try {
      const newPrice = ethers.utils.parseEther(price.toString());
      await nftMarketPlace?.updateListing(nftAddress, tokenId, newPrice);
      setShowUpdateModal(false);
      message.success('Update Price Successfully!');
    } catch (e) {
      message.error('Update Price Failed...');
    }
  };

  const renderButtonGroup = () => {
    if (expired) {
      return (
        <Button className='w-full mt-2 font-bold' size='large' disabled>
          Expired
        </Button>
      );
    }
    return isOwner ? (
      <Button
        type='primary'
        className='w-full mt-2 font-bold'
        size='large'
        onClick={handleShowUpdateModal}
      >
        Update
      </Button>
    ) : (
      <Button className='w-full mt-2 font-bold' size='large'>
        Buy
      </Button>
    );
  };

  return (
    <>
      <Card
        hoverable
        cover={
          tokenInfo ? (
            <img alt='nft' src={tokenInfo.image} />
          ) : (
            <Skeleton.Image />
          )
        }
      >
        {isOwner && !expired && (
          <DeleteOutlined
            onClick={handleCancelItem}
            className='text-red-500 text-lg absolute top-4 right-4'
          />
        )}
        {tokenInfo ? (
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
        ) : (
          <Skeleton />
        )}
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
              className='font-bold'
            >
              {seller}
            </Text>
          </div>
        </div>
        <div>{renderButtonGroup()}</div>
      </Card>
      <UpdateModal
        visible={showUpdateModal}
        onClose={handleCloseUpdateModal}
        onOk={handleUpdateItem}
        image={tokenInfo?.image}
        price={price}
      />
    </>
  );
};

export default NftCard;
