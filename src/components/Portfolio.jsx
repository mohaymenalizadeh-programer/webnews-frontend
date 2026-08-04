import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const API_BASE = 'https://webflow.pythonanywhere.com';

function Portfolio() {
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => setSingleData(res.data))
      .catch(err => console.error("خطا در دریافت داده‌ها:", err));
  }, []);

  if (!singleData) return <div className="custom-loading-box">در حال بارگذاری...</div>;

  return (
    <div className="portfolio-container" dir="rtl">
      <div className="portfolio-grid">
        
        {singleData.portfolio?.map((item, i) => (
          <div key={`port-${i}`} className="portfolio-card">
            
            <div className="portfolio-card-img-wrapper">
              {item.img_portfolio && (
                <img 
                  src={`${API_BASE}/media/${item.img_portfolio}`} 
                  alt={item.ttile_portfolio || "portfolio"} 
                />
              )}
            </div>

            {/* محتوا */}
            <div className="portfolio-card-content">
              <span className="portfolio-badge">{item.text_portfolio}</span>
              <h3 className="portfolio-card-title">{item.ttile_portfolio}</h3>

              {/* وقتی کلیک کنی، فایل مستقیم توی تب جدید باز میشه */}
              {item.file_portfoli && (
                <a 
                  href={`${API_BASE}/media/${item.file_portfoli}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-view-btn"
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                >
                  مشاهده فایل پروژه
                </a>
              )}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Portfolio;