import { gql } from '@apollo/client';

export const GET_ACTIVE_ITEM = gql`
  {
    activeItems {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
