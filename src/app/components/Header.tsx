import Link from 'next/link';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-[#4A0E78]"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5Z" />
            <path d="m2 17 10 5 10-5" />
            <path d="m2 12 10 5 10-5" />
          </svg>
          <span className="text-[#4A0E78] font-bold text-xl">JOURNEY AI</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link className="text-gray-600 hover:text-[#4A0E78]" href="#">
            Home
          </Link>
          <Link className="text-gray-600 hover:text-[#4A0E78]" href="#">
            About
          </Link>
          <Link className="text-gray-600 hover:text-[#4A0E78]" href="#">
            Destination
          </Link>
          <Link className="text-gray-600 hover:text-[#4A0E78]" href="#">
            Contact
          </Link>
        </nav>
        <button className="p-2 rounded-full bg-[#4A0E78] text-white">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;