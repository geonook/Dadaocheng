import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'purpose', href: '#purpose' },
    { key: 'instructions', href: '#instructions' },
    { key: 'tasks', href: '#tasks' },
    { key: 'about', href: '#about' },
    { key: 'upload', href: '#upload' },
    { key: 'contact', href: '#contact' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-green-800">
              {language === 'zh' ? '康橋大稻埕' : 'KCIS Dadaocheng'}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.nav[item.key]}
                </button>
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
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                >
                  {t.nav[item.key]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

