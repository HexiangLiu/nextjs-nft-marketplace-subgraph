import { useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import contractAddress from '@/constants/contractAddress.json';
import contractAbi from '@/constants/abi.json';
import { Web3WalletContext } from '@/app/provider';

const useRefetchData = (refetch: (variables?: any) => Promise<any>) => {
  const { isConnected, signer, chainId } = useContext(Web3WalletContext);
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
      NftMarketPlace.on('ItemBought', () => {
        refetch();
      });

      return () => {
        NftMarketPlace.removeAllListeners();
      };
    }
  }, [isConnected]);
};

export default useRefetchData;
