import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Newtechnology.css';

const API_BASE = 'https://webflow.pythonanywhere.com';

// تابع ساخت آدرس معتبر برای تصاویر
const getImgUrl = (imgPath) => {
  if (!imgPath) return 'https://via.placeholder.com/300x180?text=No+Image';
  if (imgPath.startsWith('http')) return imgPath;
  return `${API_BASE}/media/${imgPath}`;
};

// تابع تبدیل زمان به صورت نسبی و فارسی
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

function Latestdecoration() {
  const [techData, setTechData] = useState({ big: null, small: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/single/`),
      axios.get(`${API_BASE}/api/list/`)
    ])
      .then(([singleRes, listRes]) => {
        setTechData({
          big: singleRes.data.technology_one?.[0] || singleRes.data.technology?.[0] || null,
          small: listRes.data.technology || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("خطا در دریافت اطلاعات:", err);
        setLoading(false);
      });
  }, []);

  const handleNavigate = (slug) => {
    if (!slug) return;
    // فقط انتقال انجام می‌شود؛ ثبت بازدید در صفحه مقصد انجام می‌گیرد
    navigate(`/technology/${slug}`);
  };

  if (loading) {
    return <div className="tech-wrapper" dir="rtl"><p>در حال بارگذاری...</p></div>;
  }

  return (
    <section className="tech-wrapper" dir="rtl">
      <div className="section-header">
        <div className="blue-bar"></div>
        <h2 className="section-title">جدیدترین تکنولوژی</h2>
      </div>

      <div className="tech-layout">
        {/* کارت بزرگ اصلی */}
        {techData.big && (
          <div className="big-tech-card" onClick={() => handleNavigate(techData.big?.slug)}>
            <img 
              src={getImgUrl(techData.big?.img_Technology)} 
              alt={techData.big?.matn || "تکنولوژی"} 
              className="main-img" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
            />
            <div className="overlay">
              <span className="tag">جدید</span>
              <h3>{techData.big?.matn}</h3>
              <p>{techData.big?.explanation}</p>
              <div className="item-meta-container" style={{ marginTop: '10px' }}>
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 16 14"></polyline>
                  </svg>
                  {getRelativeTime(techData.big?.publish_date)}
                </span>
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {techData.big?.views || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* لیست کارت‌های کوچک */}
        <div className="small-tech-list">
          {techData.small.map((item, index) => (
            <div key={index} className="small-item" onClick={() => handleNavigate(item?.slug)}>
              <img 
                src={getImgUrl(item?.img_Technology)} 
                alt={item?.matn || "خبر"} 
                className="mini-img" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              />
              <div className="text-content">
                <div className="item-title">{item?.matn}</div>
                <div className="item-meta-container">
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 16 14"></polyline>
                    </svg>
                    {getRelativeTime(item?.publish_date)}
                  </span>
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {item?.views || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Latestdecoration;