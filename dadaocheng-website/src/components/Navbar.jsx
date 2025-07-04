import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const t = translations[language];

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'storymap', path: '/storymap', special: true },
    { key: 'upload', path: '/upload' },
    { key: 'results', path: '/results' }
  ];

  // Handle scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 backdrop-blur-sm border-b z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 border-gray-200 shadow-md' 
        : 'bg-white/90 border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-green-800 hover:text-green-900 transition-colors">
              {language === 'zh' ? '康橋大稻埕' : 'KCIS Dadaocheng'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    item.special
                      ? location.pathname === item.path
                        ? 'text-white bg-gradient-to-r from-yellow-500 to-orange-500 font-semibold shadow-md'
                        : 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border border-yellow-300'
                      : location.pathname === item.path
                        ? 'text-green-800 bg-green-50 font-semibold'
                        : 'text-gray-700 hover:text-green-800'
                  }`}
                  aria-label={`Navigate to ${t.nav[item.key]}`}
                >
                  {item.special && '⭐ '}{t.nav[item.key]}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'zh' ? 'EN' : '中'}</span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    item.special
                      ? location.pathname === item.path
                        ? 'text-white bg-gradient-to-r from-yellow-500 to-orange-500 font-semibold shadow-md'
                        : 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border border-yellow-300'
                      : location.pathname === item.path
                        ? 'text-green-800 bg-green-50 font-semibold'
                        : 'text-gray-700 hover:text-green-800'
                  }`}
                  aria-label={`Navigate to ${t.nav[item.key]}`}
                >
                  {item.special && '⭐ '}{t.nav[item.key]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

