import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_BASE = 'https://webflow.pythonanywhere.com';

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

function Home() {
  const [singleData, setSingleData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/single/`)
      .then(res => setSingleData(res.data))
      .catch(err => console.error(err));
  }, []);

  const registerView = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
  };

  if (!singleData) return <div className="custom-loading-box">در حال بارگذاری...</div>;

  return (
    <div>
            <div className="titlerrtr">
        <h2>جدیدترین مطالب</h2>
        <span className="red-mark"></span>
      </div>
    <div className="custom-home-news-wrapper" dir="rtl">
      <div className="custom-news-grid-layout">
        {singleData.lifestyle_archive?.map((item, i) => (
          <div key={`life-${i}`} className="custom-single-card-item" onClick={() => registerView('lifestyle', item.slug)}>
            <div className="custom-card-image-container">
              <img src={`${API_BASE}/media/${item.img_Lifestyle}`} alt="img" className="custom-card-image-box" />
              <span className="custom-status-badge custom-badge-green">سبک زندگی</span>
            </div>
            <div className="custom-card-body-content">
              <div>
              <p className="custom-featured-desc-text">{item.begtxt}</p>
                <p className="custom-main-title-text">{item.longtitle}</p>

              </div>
              <div className="custom-meta-info-row">
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item.views || 0}
                </span>
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {getRelativeTime(item.publish_date)}
                </span>
              </div>
            </div>
          </div>
        ))}


        {singleData.decoration_archive?.map((item, i) => (
          <div key={`dec-${i}`} className="custom-single-card-item" onClick={() => registerView('decoration', item.slug)}>
            <div className="custom-card-image-container">
              <img src={`${API_BASE}/media/${item.img_Decoration}`} alt="img" className="custom-card-image-box" />
              <span className="custom-status-badge custom-badge-purple">دکوراسیون</span>
            </div>
            <div className="custom-card-body-content">
              <div>
              <p className="custom-featured-desc-text">{item.text}</p>
                <p className="custom-main-title-text">{item.title}</p>
              </div>
              <div className="custom-meta-info-row">
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item.views || 0}
                </span>
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {getRelativeTime(item.publish_date)}
                </span>
              </div>
            </div>
          </div>
        ))}


        {singleData.technology_archive?.map((item, i) => (
          <div key={`tech-${i}`} className="custom-single-card-item" onClick={() => registerView('technology', item.slug)}>
            <div className="custom-card-image-container">
              <img src={`${API_BASE}/media/${item.img_Technology}`} alt="img" className="custom-card-image-box" />
              <span className="custom-status-badge custom-badge-blue">تکنولوژی</span>
            </div>
            <div className="custom-card-body-content">
              <div>
              <p className="custom-featured-desc-text">{item.matn}</p>
                <p className="custom-main-title-text">{item.explanation}</p>
              </div>
              <div className="custom-meta-info-row">
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item.views || 0}
                </span>
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {getRelativeTime(item.publish_date)}
                </span>
              </div>
            </div>
          </div>
        ))}


        {singleData.artculture_archive?.map((item, i) => (
          <div key={`art-${i}`} className="custom-single-card-item" onClick={() => registerView('artculture', item.slug)}>
            <div className="custom-card-image-container">
              <img src={`${API_BASE}/media/${item.img_Artculture}`} alt="img" className="custom-card-image-box" />
              <span className="custom-status-badge custom-badge-cyan">فرهنگ و هنر</span>
            </div>
            <div className="custom-card-body-content">
              <div>
              <p className="custom-featured-desc-text">{item.dodslg}</p>
                <p className="custom-main-title-text">{item.Artculture_title}</p>
              </div>
              <div className="custom-meta-info-row">
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item.views || 0}
                </span>
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {getRelativeTime(item.publish_date)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {singleData.newsoftheday_archive?.map((item, i) => (
          <div key={`day-${i}`} className="custom-single-card-item" onClick={() => registerView('newsoftheday', item.slug)}>
            <div className="custom-card-image-container">
              <img src={`${API_BASE}/media/${item.img_ftheday}`} alt="img" className="custom-card-image-box" />
              <span className="custom-status-badge custom-badge-red">اخبار روز</span>
            </div>
            <div className="custom-card-body-content">
              <div>
              <p className="custom-featured-desc-text">{item.txt_news}</p>
                <h3 className="custom-main-title-text">{item.title_news}</h3>

              </div>
              <div className="custom-meta-info-row">
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  {item.views || 0}
                </span>
                <span className="custom-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {getRelativeTime(item.publish_date)}
                </span>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
    </div>
  );
}

export default Home;