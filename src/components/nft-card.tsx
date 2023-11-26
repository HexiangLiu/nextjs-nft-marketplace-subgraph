import {
  Card,
  Typography,
  Skeleton,
  Button,
  Modal,
  message,
  Image,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Contract, ethers } from 'ethers';
import { useEffect, useContext, useState, useMemo } from 'react';
import { NftCardProps } from '@/types';
import contractAbi from '@/constants/abi.json';
import contractAddress from '@/constants/contractAddress.json';
import { Web3WalletContext } from '@/app/provider';
import UpdateModal from './update-list-modal';
import SellModal from './sell-list-modal';
import ApproveModal from './approve-modal';

const { Text } = Typography;

const NftCard: React.FC<{ nftInfo: NftCardProps }> = ({ nftInfo }) => {
  const {
    price,
    seller,
    tokenId,
    nftAddress,
    buyer,
    image,
    name,
    description,
  } = nftInfo;

  const { chainId, signer, address } = useContext(Web3WalletContext);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [nftMarketPlace, setNftMarketPlace] = useState<Contract>();
  const [nftContract, setNftContract] = useState<Contract>();

  const listed = useMemo(
    () => buyer === '0x0000000000000000000000000000000000000000',
    [buyer]
  );

  const isOwner = useMemo(
    () => seller === address?.toLowerCase(),
    [seller, address]
  );

  useEffect(() => {
    initNFT();
  }, [tokenId]);

  const initNFT = async () => {
    const NftMarketPlace = new ethers.Contract(
      //@ts-ignore
      contractAddress[chainId]?.nftMarketplaceAddress,
      contractAbi.nftMarketplaceAbi,
      signer
    );
    const nftContract = new ethers.Contract(
      nftAddress,
      contractAbi.basicNFTAbi,
      signer
    );
    setNftContract(nftContract);
    setNftMarketPlace(NftMarketPlace);
  };

  const handleShowUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleShowSellModal = async () => {
    setShowSellModal(true);
  };

  const handleCloseSellModal = () => {
    setShowSellModal(false);
  };

  const handleShowApproveModal = () => {
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
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

  const listItem = async (price: number) => {
    try {
      const newPrice = ethers.utils.parseEther(price.toString());
      await nftMarketPlace?.listItem(nftAddress, tokenId, newPrice);
      setShowSellModal(false);
      message.success('List NFT Successfully!');
    } catch (e) {
      message.error('List NFT Failed...');
    }
  };

  const handleSellItem = async (price: number) => {
    const address = await nftContract?.getApproved(tokenId);
    if (address !== nftMarketPlace?.address) {
      handleShowApproveModal();
    } else {
      await listItem(price);
    }
  };

  const handleBuyItem = async () => {
    try {
      await nftMarketPlace?.buyItem(nftAddress, tokenId, { value: price });
      message.success('Buy NFT success!');
    } catch (e) {
      message.error('Buy NFT failed...');
    }
  };

  const renderButtonGroup = () => {
    if (!listed) {
      return isOwner ? (
        <Button
          className='w-full mt-2 font-bold'
          size='large'
          onClick={handleShowSellModal}
        >
          Sell
        </Button>
      ) : (
        <Button className='w-full mt-2 font-bold' size='large' disabled>
          No Sale
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
      <Button
        className='w-full mt-2 font-bold'
        size='large'
        onClick={handleBuyItem}
      >
        Buy
      </Button>
    );
  };

  return (
    <>
      <Card
        hoverable
        cover={image ? <Image alt='nft' src={image} /> : <Skeleton.Image />}
      >
        {isOwner && listed && (
          <DeleteOutlined
            onClick={handleCancelItem}
            className='text-red-500 text-lg absolute top-4 right-4'
          />
        )}
        {name ? (
          <div>
            <div className='font-bold'>
              <Text
                ellipsis={{
                  tooltip: name,
                }}
              >
                {name}
              </Text>
            </div>
            <Text
              ellipsis={{
                tooltip: description,
              }}
            >
              {description}
            </Text>
          </div>
        ) : (
          <Skeleton />
        )}
        <div className='flex justify-between'>
          <div className='flex flex-col w-1/2'>
            <div className='text-gray-500'>Price</div>
            <div className='font-bold'>
              {listed
                ? `${ethers.utils.formatEther(`${price}`).toString()}ETH`
                : '-'}
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
        image={image}
        price={price}
      />
      <SellModal
        visible={showSellModal}
        onClose={handleCloseSellModal}
        onOk={handleSellItem}
        image={image}
      />
      <ApproveModal
        visible={showApproveModal}
        onClose={handleCloseApproveModal}
        image={image}
        to={nftMarketPlace?.address}
        tokenId={tokenId}
        nftContract={nftContract}
      />
    </>
  );
};

export default NftCard;
