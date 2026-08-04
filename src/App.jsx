// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Latestnews from './components/Latestnews.jsx';
import Latestdecoration from './components/Latestdecoration.jsx';
import Newtechnology from './components/Newtechnology.jsx';
import NewsHub from './components/NewsHub.jsx';
import Latest_tek_dec from './components/Latest_tek_dec.jsx';
import Artcultureslider from './components/Artcultureslider.jsx';
import Footer from './components/Footer.jsx';

import NewsOfDayPage from './components/NewsOfDayPage.jsx';
import TechnologyPage from './components/TechnologyPage.jsx';
import LifestylePage from './components/LifestylePage.jsx';
import DecorationPage from './components/DecorationPage.jsx';
import ArtCulturePage from './components/ArtCulturePage.jsx';
import DetailPage from './components/DetailPage.jsx';
import Portfolio from './components/Portfolio.jsx';

function HomePage() {
  return (
    <>
      <Latestnews />
      <Latestdecoration />
      <Home />
      <Newtechnology />
      <NewsHub />
      <Latest_tek_dec />
      <Artcultureslider />
    </>
  );
}

function App() {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/news-of-day" element={<NewsOfDayPage />} />
        <Route path="/newsoftheday" element={<NewsOfDayPage />} />
        
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="/decoration" element={<DecorationPage />} />
        <Route path="/artculture" element={<ArtCulturePage />} />
        
        <Route path="/:category/:slug" element={<DetailPage />} />
        <Route path="/Portfolio" element={<Portfolio />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;