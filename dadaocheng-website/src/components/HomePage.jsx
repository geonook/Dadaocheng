import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { useScrollToSection } from '../hooks/useScrollToSection';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import dadaochengStreet from '../assets/dadaocheng-street.jpg';

const HomePage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const scrollToSection = useScrollToSection();
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section 
      ref={ref}
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={dadaochengStreet}
          alt={language === 'zh' ? '大稻埕街景' : 'Dadaocheng Street'}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
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
          {/* 特殊 StoryMap 按鈕 */}
          <Link to="/storymap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-bold flex items-center space-x-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
              aria-label={language === 'zh' ? '查看第1組 StoryMap' : 'View Group 1 StoryMap'}
            >
              <Star className="h-5 w-5" />
              <MapPin className="h-5 w-5" />
              <span>{language === 'zh' ? '第1組 StoryMap' : 'Group 1 StoryMap'}</span>
            </Button>
          </Link>
          
          <Button
            size="lg"
            onClick={() => scrollToSection('#tasks')}
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg font-semibold flex items-center space-x-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label={t.home.cta}
          >
            <span>{t.home.cta}</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection('#upload')}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold flex items-center space-x-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label={t.home.uploadCta}
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

export default memo(HomePage);

