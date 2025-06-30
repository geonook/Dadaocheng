import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import { PurposeSection, InstructionsSection, AboutSection, ContactSection } from './components/Sections';
import TasksSection from './components/TasksSection';
import UploadSection from './components/UploadSection';
import TraditionalFoodTour from './components/TraditionalFoodTour';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <HomePage />
          <PurposeSection />
          <InstructionsSection />
          <TasksSection />
          <UploadSection />
          <AboutSection />
          <ContactSection />
          <TraditionalFoodTour />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
