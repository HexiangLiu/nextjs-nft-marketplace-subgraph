import { useState } from 'react';
import { Modal, message, Image, Skeleton } from 'antd';
import { Contract } from 'ethers';

interface ApproveModalProps {
  visible: boolean;
  tokenId: string;
  onClose: () => void;
  image?: string;
  to?: string;
  nftContract?: Contract;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  visible,
  nftContract,
  tokenId,
  to,
  onClose,
  image,
}) => {
  const [loading, setLoading] = useState(false);
  const handleApprove = async () => {
    try {
      await nftContract?.approve(to, tokenId);
      setLoading(true);
      nftContract?.once('Approval', async () => {
        message.success('Approve successfully!');
        onClose();
      });
    } catch (e) {
      setLoading(false);
      message.error('Approve failed...');
    }
  };
  return (
    <Modal
      title='NFT Details'
      okText='Approve'
      cancelText='Cancel'
      open={visible}
      onOk={handleApprove}
      onCancel={onClose}
      okButtonProps={{
        loading,
      }}
      destroyOnClose
    >
      <div className='flex justify-between items-center'>
        <div>
          {image ? <Image alt='nft' src={image} /> : <Skeleton.Image />}
        </div>
        <p className='font-bold text-lg'>Approve maketplace to list your NFT</p>
      </div>
    </Modal>
  );
};

export default ApproveModal;
