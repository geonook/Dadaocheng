import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* School Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'zh' ? '林口康橋國際學校' : 'Linkou Kang Chiao International School'}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {language === 'zh' 
                ? '致力於提供優質的國際教育，培養具有全球視野的未來領袖。'
                : 'Committed to providing quality international education and nurturing future leaders with global perspectives.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'zh' ? '快速連結' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#purpose" className="text-gray-300 hover:text-white transition-colors">
                  {t.nav.purpose}
                </a>
              </li>
              <li>
                <a href="#tasks" className="text-gray-300 hover:text-white transition-colors">
                  {t.nav.tasks}
                </a>
              </li>
              <li>
                <a href="#upload" className="text-gray-300 hover:text-white transition-colors">
                  {t.nav.upload}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'zh' ? '聯絡資訊' : 'Contact Information'}
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>{t.contact.phone}</p>
              <p>{t.contact.email}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 sm:mb-0">
            © 2024 {language === 'zh' ? '林口康橋國際學校' : 'Linkou Kang Chiao International School'}. 
            {language === 'zh' ? ' 版權所有。' : ' All rights reserved.'}
          </p>
          
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            {t.common.backToTop}
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

