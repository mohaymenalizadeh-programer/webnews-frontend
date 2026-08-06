import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Latestdecoration.css';
import { Helmet } from 'react-helmet-async';

const API_BASE = 'https://webflow.pythonanywhere.com';


const getImgUrl = (path) => {
  if (!path) return 'https://placehold.co/100x100?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/media/${path.replace(/.*\/media\//, '')}`;
};

function Latestdecoration() {
  const [singleData, setSingleData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
          {decorations.map((item, index) => (
            <div 
              key={item.slug || index} 
              className="latest-decoration-item" 
              onClick={() => registerView('technology', item.slug)}
            >
              <div className="item-image-wrapper">
                <img 
                  src={getImgUrl(item.img_Technology)} 
                  alt={item.matn || ''} 
                  className="item-image" 
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                />
              </div>
              <div className="item-title-wrapper">
                <p className="gdgfhflgjlgjl">{item.matn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Latestdecoration;