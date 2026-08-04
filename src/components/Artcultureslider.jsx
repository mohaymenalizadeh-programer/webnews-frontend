import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Artcultureslider.css';

const API_BASE = 'https://webflow.pythonanywhere.com';

function getRelativeTime(dateString) {
  if (!dateString) return 'چندی پیش';
  
  const now = new Date();
  const past = new Date(dateString);
  

  if (isNaN(past.getTime())) return 'چندی پیش';

  const diffInSeconds = Math.floor((now - past) / 1000);


  if (diffInSeconds < 30) return "همین الان";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ساعت پیش`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "دیروز";
  if (diffInDays < 7) return `${diffInDays} روز پیش`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} هفته پیش`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} ماه پیش`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} سال پیش`;
}

function Artcultureslider() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        if (res.data && res.data.artcultureslider) {
          setItems(res.data.artcultureslider);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) setVisibleCards(1);
      else if (window.innerWidth <= 768) setVisibleCards(2);
      else if (window.innerWidth <= 1024) setVisibleCards(3);
      else setVisibleCards(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCards);

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (items.length <= visibleCards) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, items.length, visibleCards]);

  const registerView = (category, slug) => {
    if (!slug) {
      console.error("اسلاگ خبر یافت نشد!");
      return;
    }

    navigate(`/${category}/${slug}`);
  };

  if (!items.length) return null;

  return (
    <div className="acs-wrapper" dir="rtl">
      <h2 className="acs-title">فرهنگ و هنر</h2>
      <div className="acs-container">
        {items.length > visibleCards && (
          <>
            <button className="acs-arrow acs-arrow-prev" onClick={handlePrev}>❮</button>
            <button className="acs-arrow acs-arrow-next" onClick={handleNext}>❯</button>
          </>
        )}
        <div className="acs-slider-box">
          <div
            className="acs-track"
            style={{ transform: `translateX(${currentIndex * (100 / visibleCards)}%)` }}
          >
            {items.map((item, index) => {
              const imgPath = item.img_Artculture || '';
              const imgSrc = imgPath.startsWith('http') 
                ? imgPath 
                : imgPath.startsWith('/media/') 
                  ? `${API_BASE}${imgPath}`
                  : `${API_BASE}/media/${imgPath.replace(/^\//, '')}`;

              const newsSlug = item.slug || item.slug_news;

              return (
                <div
                  key={index}
                  className="acs-card"
                  onClick={() => registerView('artculture', newsSlug)}
                >
                  <div className="acs-img-box">
                    <img
                      className="acs-img"
                      src={imgSrc}
                      alt={item.dodslg || ''}
                      onError={(e) => { e.target.src = 'https://placehold.co/300x180?text=No+Image'; }}
                    />
                  </div>
                  <div className="acs-content">
                    <h3>{item.dodslg}</h3>
                    <div className="acs-meta">
                      <span>{getRelativeTime(item.publish_date)}</span>
                      <span>{item.views || 0} بازدید</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Artcultureslider;