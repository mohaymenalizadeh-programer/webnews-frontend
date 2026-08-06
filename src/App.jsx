import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import LatestNews from './components/Latestnews.jsx';
import NewsOfDayPage from './components/NewsOfDayPage.jsx';
import TechnologyPage from './components/TechnologyPage.jsx';
import LifestylePage from './components/LifestylePage.jsx';
import DecorationPage from './components/DecorationPage.jsx';
import ArtCulturePage from './components/ArtCulturePage.jsx';
import DetailPage from './components/DetailPage.jsx';
import Portfolio from './components/Portfolio.jsx';

function App() {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<LatestNews />} />
        
        <Route path="/news-of-day" element={<NewsOfDayPage />} />
        <Route path="/newsoftheday" element={<NewsOfDayPage />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="/decoration" element={<DecorationPage />} />
        <Route path="/artculture" element={<ArtCulturePage />} />
        
        <Route path="/:category/:slug" element={<DetailPage />} />
        <Route path="/Portfolio" element={<Portfolio />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;