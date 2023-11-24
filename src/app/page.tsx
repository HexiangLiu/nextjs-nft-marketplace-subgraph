'use client';

import { useQuery, gql } from '@apollo/client';

const GET_ACTIVE_ITEM = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default function Home() {
  const { data, loading } = useQuery(GET_ACTIVE_ITEM);
  if (loading) return <p>Loading ...</p>;
  return <div>haha</div>;
}
