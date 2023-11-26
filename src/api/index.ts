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

export const GET_USER_ACTIVE_ITEM = gql`
  query ActiveItems($owner: String!) {
    activeItems(where: { seller: $owner }) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
