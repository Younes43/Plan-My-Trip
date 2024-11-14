'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SignInModal from './SignInModal';

const Header = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const refreshHome = () => {
    window.location.href = '/';
  };

  // Function to get display name
  const getDisplayName = () => {
    if (!user) return '';
    if (user.isAnonymous) return 'Guest';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  return (
    <header className="bg-white py-4 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={refreshHome}
        >
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
          <span className="text-[#4A0E78] font-bold text-xl">JOURNIFY AI</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button className="text-gray-600 hover:text-[#4A0E78]" onClick={() => router.push('/')}>
            Home
          </button>
          <button className="text-gray-600 hover:text-[#4A0E78]" onClick={() => scrollToSection('about')}>
            About
          </button>
          <button className="text-gray-600 hover:text-[#4A0E78]" onClick={() => scrollToSection('destinations')}>
            Destinations
          </button>
          <button className="text-gray-600 hover:text-[#4A0E78]" onClick={() => scrollToSection('contact')}>
            Contact
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-600">
                Welcome, {getDisplayName()}
              </span>
              <button
                onClick={() => signOut()}
                className="text-white bg-[#4A0E78] px-4 py-2 rounded-md hover:bg-[#3A0B5E]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowSignInModal(true)}
              className="text-white bg-[#4A0E78] px-4 py-2 rounded-md hover:bg-[#3A0B5E]"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        showAuthMessage={false}
      />
    </header>
  );
};

export default Header;