import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import dadaochengStreet from '../assets/dadaocheng-street.jpg';

const HomePage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={dadaochengStreet}
          alt="Dadaocheng Street"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {t.home.title}
        </h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8 text-orange-300">
          {t.home.subtitle}
        </h2>
        <p className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          {t.home.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => scrollToSection('#tasks')}
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg font-semibold flex items-center space-x-2"
          >
            <span>{t.home.cta}</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection('#upload')}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>{t.home.uploadCta}</span>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;

