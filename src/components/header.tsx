import Link from 'next/link';

const Header = () => {
  return (
    <nav className='px-5 mb-4 flex flex-row justify-between items-center bg-black'>
      <h1 className='font-bold text-3xl text-white'>NFT Marketplace</h1>
      <Link className='text-white font-bold no-underline' href='/'>
        Home
      </Link>
      <Link className='text-white font-bold no-underline' href='/sell'>
        Sell NFT
      </Link>
      <w3m-button />
    </nav>
  );
};

export default Header;
