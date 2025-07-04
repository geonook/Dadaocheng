import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ResultsProvider } from './contexts/ResultsContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import StoryMapDisplay from './components/StoryMapDisplay';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ResultsProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/group1" element={<StoryMapDisplay />} />
                  <Route path="/storymap" element={<StoryMapDisplay />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ResultsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
