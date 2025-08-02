'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image 
                src="/images/Logo_GZW_Horizontal_300x65px.png" 
                alt="Gartenzauberwerk Logo" 
                width={300}
                height={65}
                className="h-6 sm:h-8 lg:h-10 w-auto"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
            <Link
              href="/"
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-green-100 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <span className="hidden sm:inline">📋 Formular</span>
              <span className="sm:hidden">📋</span>
            </Link>
            
            <Link
              href="/management"
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                isActive('/management')
                  ? 'bg-green-100 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <span className="hidden sm:inline">⚙️ Verwaltung</span>
              <span className="sm:hidden">⚙️</span>
            </Link>
          </div>

          {/* Right side - could add user info or other elements */}
          <div className="hidden sm:flex items-center">
            <div className="text-xs sm:text-sm text-gray-500">
              MITARBEITERSTAMMDATEN
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 