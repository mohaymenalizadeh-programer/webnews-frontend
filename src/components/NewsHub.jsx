import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewsHub.css';
import { Helmet } from 'react-helmet-async';

const API_BASE = 'https://webflow.pythonanywhere.com';

const getImgUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/300x180';
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

function NewsHub() {
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        setListData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("خطا در دریافت اطلاعات:", err);
        setLoading(false);
      });
  }, []);

  const registerView = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
  };

  if (loading || !listData) {
    return <div className="grid-main-wrapper" dir="rtl"><p>در حال بارگذاری...</p></div>;
  }

  return (
    <div className="grid-main-wrapper" dir="rtl">

      <div className="grid-title-header">
        <span className="red-mark"></span>
        <h2>جدیدترین خبرها</h2>
      </div>
      <div className="grid-cards-container">


        {listData.latest_news_of_day?.map((item, i) => (
          <div key={i} className="grid-news-card" onClick={() => registerView('newsoftheday', item?.slug)}>
            <img 
              src={getImgUrl(item?.img_ftheday)} 
              alt="img" 
              className="grid-card-img" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Error'; }}
            />
            <div className="grid-card-content">
              <p className="grid-card-title">{item?.txt_news || item?.title_news}</p>
              <div className="grid-card-meta">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg>
                  {getRelativeTime(item?.publish_date)}
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item?.views || 0}
                </span>
              </div>
            </div>
          </div>
        ))}


        {listData.latest_lifestyle?.map((item, i) => (
          <div key={i} className="grid-news-card" onClick={() => registerView('lifestyle', item?.slug)}>
            <img 
              src={getImgUrl(item?.img_Lifestyle)} 
              alt="img" 
              className="grid-card-img" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Error'; }}
            />
            <div className="grid-card-content">
              <p className="grid-card-title">{item?.begtxt || item?.longtitle}</p>
              <div className="grid-card-meta">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg>
                  {getRelativeTime(item?.publish_date)}
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item?.views || 0}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* ۳. دکوراسیون */}
        {listData.latest_decoration?.map((item, i) => (
          <div key={i} className="grid-news-card" onClick={() => registerView('decoration', item?.slug)}>
            <img 
              src={getImgUrl(item?.img_Decoration)} 
              alt="img" 
              className="grid-card-img" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Error'; }}
            />
            <div className="grid-card-content">
              <p className="grid-card-title">{item?.text || item?.title}</p>
              <div className="grid-card-meta">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg>
                  {getRelativeTime(item?.publish_date)}
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item?.views || 0}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* ۴. تکنولوژی */}
        {listData.latest_technology?.map((item, i) => (
          <div key={i} className="grid-news-card" onClick={() => registerView('technology', item?.slug)}>
            <img 
              src={getImgUrl(item?.img_Technology)} 
              alt="img" 
              className="grid-card-img" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Error'; }}
            />
            <div className="grid-card-content">
              <p className="grid-card-title">{item?.matn || item?.explanation}</p>
              <div className="grid-card-meta">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg>
                  {getRelativeTime(item?.publish_date)}
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item?.views || 0}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* ۵. فرهنگ و هنر */}
        {listData.latest_art_culture?.map((item, i) => (
          <div key={i} className="grid-news-card" onClick={() => registerView('artculture', item?.slug)}>
            <img 
              src={getImgUrl(item?.img_Artculture)} 
              alt="img" 
              className="grid-card-img" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Error'; }}
            />
            <div className="grid-card-content">
              <p className="grid-card-title">{item?.dodslg || item?.Artculture_title}</p>
              <div className="grid-card-meta">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg>
                  {getRelativeTime(item?.publish_date)}
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item?.views || 0}
                </span>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default NewsHub;