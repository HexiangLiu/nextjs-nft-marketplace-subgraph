import { useState } from 'react';
import { Modal, Image, Skeleton, InputNumber } from 'antd';
import { ethers } from 'ethers';

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onOk: (price: number) => void;
  image?: string;
  price?: number;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  onClose,
  onOk,
  image,
  price,
}) => {
  const [newPrice, setNewPrice] = useState<number>(0);
  const handleConfirm = async () => {
    onOk(newPrice);
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      title='NFT Details'
      okText='Update'
      cancelText='Leave it'
      destroyOnClose
    >
      <div>{image ? <Image alt='nft' src={image} /> : <Skeleton.Image />}</div>
      <div>
        <span className='text-gray-500'>Current Price：</span>
        <span className='font-bold'>
          {price
            ? `${ethers.utils.formatEther(`${price}`).toString()} ETH`
            : '-'}
        </span>
      </div>
      <div className='flex items-center'>
        <span className='text-gray-500 flex-shrink-0'>Update Price：</span>
        <InputNumber
          onChange={(v) => setNewPrice(v!)}
          value={newPrice}
          min={0}
          size='middle'
          addonAfter='ETH'
        />
      </div>
    </Modal>
  );
};

export default UpdateModal;
