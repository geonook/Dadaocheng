import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling to sections
 * @returns {Function} scrollToSection function
 */
export const useScrollToSection = () => {
  const scrollToSection = useCallback((href, offset = 80) => {
    const element = document.querySelector(href);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return scrollToSection;
};