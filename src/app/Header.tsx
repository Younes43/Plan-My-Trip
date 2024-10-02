import Link from 'next/link';
import { Home, Info, Phone, Globe } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-sky-100 bg-opacity-5 shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-sky-200 transition-colors duration-300 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            <span>Plan My Trip</span>
          </Link>
          <div className="space-x-6">
            <Link href="/" className="text-white hover:text-sky-200 transition-colors duration-300 flex items-center">
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link href="/about" className="text-white hover:text-sky-200 transition-colors duration-300 flex items-center">
              <Info className="w-5 h-5 mr-1" />
              <span>About</span>
            </Link>
            <Link href="/contact" className="text-white hover:text-sky-200 transition-colors duration-300 flex items-center">
              <Phone className="w-5 h-5 mr-1" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;