import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Latestnews.css';

import Home from './Home.jsx';
import Latestdecoration from './Latestdecoration.jsx';
import Newtechnology from './Newtechnology.jsx';
import NewsHub from './NewsHub.jsx';
import Latest_tek_dec from './Latest_tek_dec.jsx';
import Artcultureslider from './Artcultureslider.jsx';

const API_BASE = 'https://webflow.pythonanywhere.com';

const getImgUrl = (path) => {
  if (!path) return 'https://placehold.co/300x180';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/media/${path.replace(/.*\/media\//, '')}`;
};

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000);

  if (diffInSeconds < 60) return "همین الان";
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
  return `${Math.floor(diffInDays / 365)} سال پیش`;
}

function LatestNews() {
  const [singleData, setSingleData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/single/`)
      .then(res => setSingleData(res.data))
      .catch(err => console.error("خطا در دریافت اطلاعات:", err));
  }, []);

  const sliderItems = [
    ...(singleData?.twonewsofdaysliders || []).map(item => ({ ...item, cat: 'newsoftheday' })),
    ...(singleData?.twolifestylesliders || []).map(item => ({ ...item, cat: 'lifestyle' })),
    ...(singleData?.twodecorationsliders || []).map(item => ({ ...item, cat: 'decoration' })),
    ...(singleData?.twotechnologysliders || []).map(item => ({ ...item, cat: 'technology' })),
    ...(singleData?.twoartculturesliders || []).map(item => ({ ...item, cat: 'artculture' }))
  ];

  useEffect(() => {
    if (!sliderItems.length) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderItems.length]);

  const registerView = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
  };

  if (!singleData) {
    return (
      <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        margin: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        margin: '0 auto', 
        textAlign: 'center',
        
      }}
    >
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="35"
          cy="35"
          r="27"
          fill="none"
          stroke="#ff156d"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="42 130"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 35 35"
            to="360 35 35"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
    );
  }
  

  return (
    <div>
      <div className="news-layout-container">
        <div className="left-cards-grid">
          {singleData.lifestyle?.map((item, i) => (
            <div key={i} className="news-card" onClick={() => registerView('lifestyle', item.slug)}>
              <img src={getImgUrl(item.img_Lifestyle)} alt="img" className="news-card-img" />
              <span className="news-badge badge-green">سبک زندگی</span>
              <div className="news-card-content">
                <p className="news-card-title">{item.begtxt}</p>
                <div className="news-card-meta">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>{getRelativeTime(item.publish_date)}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>{item.views || 0}</span>
                </div>
              </div>
            </div>
          ))}

          {singleData.decoration?.map((item, i) => (
            <div key={i} className="news-card" onClick={() => registerView('decoration', item.slug)}>
              <img src={getImgUrl(item.img_Decoration)} alt="img" className="news-card-img" />
              <span className="news-badge badge-purple">دکوراسیون</span>
              <div className="news-card-content">
                <p className="news-card-title">{item.text}</p>
                <div className="news-card-meta">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>{getRelativeTime(item.publish_date)}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>{item.views || 0}</span>
                </div>
              </div>
            </div>
          ))}

          {singleData.technology?.map((item, i) => (
            <div key={i} className="news-card" onClick={() => registerView('technology', item.slug)}>
              <img src={getImgUrl(item.img_Technology)} alt="img" className="news-card-img" />
              <span className="news-badge badge-blue">تکنولوژی</span>
              <div className="news-card-content">
                <p className="news-card-title">{item.matn}</p>
                <div className="news-card-meta">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>{getRelativeTime(item.publish_date)}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>{item.views || 0}</span>
                </div>
              </div>
            </div>
          ))}

          {singleData.artculture?.map((item, i) => (
            <div key={i} className="news-card" onClick={() => registerView('artculture', item.slug)}>
              <img src={getImgUrl(item.img_Artculture)} alt="img" className="news-card-img" />
              <span className="news-badge badge-cyan">فرهنگ و هنر</span>
              <div className="news-card-content">
                <p className="news-card-title">{item.dodslg}</p>
                <div className="news-card-meta">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>{getRelativeTime(item.publish_date)}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>{item.views || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="right-featured-container">
          {singleData.newsoftheday?.map((item, i) => (
            <div key={i} className="news-card featured-big-card" onClick={() => registerView('newsoftheday', item.slug)}>
              <img src={getImgUrl(item.img_ftheday)} alt="img" className="news-card-img" />
              <span className="news-badge badge-red">اخبار روز</span>
              <div className="news-card-content">
                <h3 className="featured-text">{item.txt_news}</h3>
                <p className="lkf">{item.title_news}</p>
                <div className="news-card-meta">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>{getRelativeTime(item.publish_date)}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>{item.views || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {sliderItems.length > 0 && (
        <div className="exact-slider-container">
          <div className="exact-slider-wrapper" style={{ transform: `translateX(${currentSlide * 100}%)` }}>
            {sliderItems.map((item, i) => {
              const slideImage = item.img_ftheday || item.img_Lifestyle || item.img_Decoration || item.img_Technology || item.img_Artculture;
              const slideTitle = item.title_news || item.longtitle || item.title || item.explanation || item.Artculture_title || item.txt_news || item.begtxt || item.text || item.matn || item.dodslg;

              return (
                <div key={i} className="exact-slide">
                  <div className="exact-card" onClick={() => registerView(item.cat, item.slug)}>
                    <div className="exact-card-media">
                      <img src={getImgUrl(slideImage)} alt="img" className="exact-img" />
                      <span className="exact-badge">اخبار ویژه</span>
                    </div>
                    <div className="exact-card-body">
                      <h2 className="exact-main-tag">پیشنهاد روز</h2>
                      <h3 className="exact-sub-title">{slideTitle}</h3>
                      <div className="exact-meta">
                        <span className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{getRelativeTime(item.publish_date)}</span>
                        </span>
                        <span className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"></path>
                          </svg>
                          <span>{item.views || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sliderItems.length > 1 && (
            <div className="exact-dots">
              {sliderItems.map((_, index) => (
                <button
                  key={index}
                  className={`exact-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className='dirsd'>
        <div className='dsdsd'>
          {singleData.decoration?.map((item, i) => (
            <div key={i} className="sdfg" onClick={() => registerView('decoration', item.slug)}>
              <img src={getImgUrl(item.img_Decoration)} alt="img" className="imageboc" />
              <span className="boxnewstxt">دکوراسیون</span>
              <div className="boxnewscontent">
                <p className="boxnewstitle">{item.text}</p>
                <div className="viewandtime">
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>{getRelativeTime(item.publish_date)}</span>
                  <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>{item.views || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dm-container-main">
          {singleData.fordecoration?.map((item, i) => (
            <div key={i} className="dm-wrapper" onClick={() => registerView('decoration', item.slug)}>
              <div className="dm-info-block">
                <p className="dm-header-text">{item.text}</p>
                <div className="dm-stats-row">
                  <span className="dm-stat-item">
                    <span className='plpl'>{item.views || 0}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </span>

                  <span className="dm-stat-item">
                    <span className='plpl'>{getRelativeTime(item.publish_date)}</span> 
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
              <img src={getImgUrl(item.img_Decoration)} alt="img" className="dm-media-thumb" />
            </div>
          ))}
        </div>
      </div>

      <Latestdecoration />
      <Home />
      <Newtechnology />
      <NewsHub />
      <Latest_tek_dec />
      <Artcultureslider />
    </div>
  );
}

export default LatestNews;