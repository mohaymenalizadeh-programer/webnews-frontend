import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewsOfDayPage.css';

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

const getImgUrl = (imgPath) => {
  if (!imgPath) return 'https://via.placeholder.com/150?text=No+Image';
  if (imgPath.startsWith('http')) return imgPath;
  return `${API_BASE}/media/${imgPath}`;
};

function DecorationPage() {
  const [newsList, setNewsList] = useState([]);
  const [latestList, setLatestList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        const data = res.data;
        if (data.alldecoration) setNewsList(data.alldecoration);

        const combinedLatest = [
          ...(data.twonewsofday || []).map(item => ({ title: item.title_news || item.txt_news, img: item.img_ftheday, slug: item.slug, cat: 'newsoftheday' })),
          ...(data.twolifestyle || []).map(item => ({ title: item.begtxt || item.longtitle, img: item.img_Lifestyle, slug: item.slug, cat: 'lifestyle' })),
          ...(data.twodecoration || []).map(item => ({ title: item.text || item.title, img: item.img_Decoration, slug: item.slug, cat: 'decoration' })),
          ...(data.twotechnology || []).map(item => ({ title: item.matn || item.explanation, img: item.img_Technology, slug: item.slug, cat: 'technology' })),
          ...(data.twoartculture || []).map(item => ({ title: item.dodslg || item.Artculture_title, img: item.img_Artculture, slug: item.slug, cat: 'artculture' }))
        ];

        setLatestList(combinedLatest);
        setLoading(false);
      })
      .catch(err => {
        console.error("خطا در دریافت اطلاعات:", err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    axios.get(`${API_BASE}/api/decoration/?search=${encodeURIComponent(searchQuery)}`)
      .then(res => {
        const results = res.data.results || res.data || [];
        setNewsList(results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const registerView = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
  };

  return (
    <div className="nod-page-wrapper" dir="rtl">
      <div className="nod-container">
        <div className="nod-header">
          <h1>دکوراسیون</h1>
        </div>

        <div className="nod-main-layout">
          <div className="nod-grid-right">
            {loading ? (
              <div className="nod-state-msg">در حال بارگذاری...</div>
            ) : newsList.length === 0 ? (
              <div className="nod-state-msg">هیچ خبری یافت نشد.</div>
            ) : (
              newsList.map((item, index) => (
                <div key={index} className="nod-news-card" onClick={() => registerView('decoration', item.slug)}>
                  <div className="nod-card-media">
                    <img 
                      src={getImgUrl(item.img_Decoration)} 
                      alt={item.title || "دکوراسیون"} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Error'; }}
                    />
                    <span className="nod-card-badge nod-card-badge-decoration">دکوراسیون</span>
                  </div>
                  <div className="nod-card-content">
                  <h2 className="nod-card-summary">{item.text}</h2>
                    <p className="nod-card-heading">{item.title}</p>
                    <div className="nod-card-footer">
                      <span className="nod-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        {item.views || 0}
                      </span>
                      <span className="nod-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {getRelativeTime(item.publish_date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="nod-sidebar-left">
            <div className="nod-widget">
              <div className="nod-widget-header">
                <span className="nod-red-square"></span>
                <h3>جستجو در سایت</h3>
              </div>
              <form className="nod-search-box" onSubmit={handleSearchSubmit}>
                <button type="submit" className="nod-search-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
                <input 
                  type="text" 
                  placeholder="دنبال چی میگردی؟" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <div className="nod-widget">
              <div className="nod-widget-header">
                <span className="nod-red-square"></span>
                <h3>جدیدترین مطالب</h3>
              </div>
              <div className="nod-latest-items">
                {latestList.map((item, index) => (
                  <div key={index} className="nod-latest-row" onClick={() => registerView(item.cat, item.slug)}>
                    <img
                      src={getImgUrl(item.img)} 
                      alt="thumb" 
                      className="nod-latest-avatar"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=No+Img'; }}
                    />
                    <p className="nod-latest-text">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecorationPage;