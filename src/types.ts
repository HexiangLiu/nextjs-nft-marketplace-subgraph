export interface NftInterface {
  nftAddress: string;
  tokenId: string;
  price?: number;
  seller?: string;
  buyer?: string;
}

export interface TokenMetaData {
  name: string;
  description?: string;
  image: string;
}

export type NftCardProps = NftInterface & TokenMetaData;
