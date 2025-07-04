import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import HomeHero from '../components/HomePage';
import { PurposeSection, InstructionsSection } from '../components/Sections';
import EnhancedTasksSection from '../components/SuperOptimized/EnhancedTasksSection';

const HomePage = () => {
  return (
    <>
      <HomeHero />
      <PurposeSection />
      <InstructionsSection />
      <ErrorBoundary>
        <EnhancedTasksSection />
      </ErrorBoundary>
    </>
  );
};

export default HomePage;