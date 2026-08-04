import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Latestdecoration.css';

const API_BASE = 'https://webflow.pythonanywhere.com';

function Latestdecoration() {
  const [singleData, setSingleData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🟢 برگشت به اندپوینت اصلی شما (/api/single/)
    axios.get(`${API_BASE}/api/single/`)
      .then(res => setSingleData(res.data))
      .catch(err => console.error("خطا در دریافت داده‌ها:", err));
  }, []);

  const registerView = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
  };

  const decorations = singleData?.decorationfinish || [];

  return (
    <div className="main-grid-container" dir="rtl">
      <div className="latest-decoration-card">
        <div className="latest-decoration-header">
          <span className="red-indicator"></span>
          <h2 className="latest-decoration-title">جدیدترین تکنولوژی</h2>
        </div>
        <div className="latest-decoration-list">
          {decorations.map((item, index) => {
            const imgPath = item.img_Technology || '';
            const imgSrc = imgPath ? (
              imgPath.startsWith('http') 
                ? imgPath 
                : imgPath.startsWith('/media/') 
                  ? `${API_BASE}${imgPath}`
                  : `${API_BASE}/media/${imgPath.replace(/^\//, '')}`
            ) : 'https://placehold.co/100x100?text=No+Image';

            return (
              <div 
                key={item.slug || index} 
                className="latest-decoration-item" 
                onClick={() => registerView('technology', item.slug)}
              >
                <div className="item-image-wrapper">
                  <img 
                    src={imgSrc} 
                    alt={item.matn || ''} 
                    className="item-image" 
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                  />
                </div>
                <div className="item-title-wrapper">
                  <p className="gdgfhflgjlgjl">{item.matn}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Latestdecoration;