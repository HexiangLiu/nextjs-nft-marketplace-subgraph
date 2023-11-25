import { useState } from 'react';
import { Modal, Image, Skeleton, InputNumber } from 'antd';
interface SellModalProps {
  visible: boolean;
  onClose: () => void;
  onOk: (price: number) => void;
  image?: string;
}

const SellModal: React.FC<SellModalProps> = ({
  visible,
  onClose,
  onOk,
  image,
}) => {
  const [price, setPrice] = useState<number>(0);
  const handleConfirm = async () => {
    onOk(price);
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      title='NFT Details'
      okText='Sell'
      cancelText='Cancel'
    >
      <div>{image ? <Image alt='nft' src={image} /> : <Skeleton.Image />}</div>
      <p className='font-bold text-lg'>
        Create a listing to allow others to purchase your NFT.
      </p>
      <div className='flex items-center'>
        <span className='text-gray-500 flex-shrink-0'>Set Price：</span>
        <InputNumber
          onChange={(v) => setPrice(v!)}
          value={price}
          min={0}
          size='middle'
          addonAfter='ETH'
        />
      </div>
    </Modal>
  );
};

export default SellModal;
