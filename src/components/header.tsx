import Link from 'next/link';

const Header = () => {
  return (
    <nav className='p-5 border-b-8 flex flex-row justify-between items-center bg-black'>
      <h1 className='font-bold text-3xl text-white'>NFT Marketplace</h1>
      <Link className='text-white font-bold' href='/'>
        Home
      </Link>
      <Link className='text-white font-bold' href='/sell'>
        Sell NFT
      </Link>
      <w3m-button />
    </nav>
  );
};

export default Header;
