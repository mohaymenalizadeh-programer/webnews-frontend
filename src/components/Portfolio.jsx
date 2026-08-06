import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';
import { Helmet } from 'react-helmet-async';

const API_BASE = 'https://webflow.pythonanywhere.com';


const getUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/media/${path.replace(/.*\/media\//, '')}`;
};

function Portfolio() {
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => setSingleData(res.data))
      .catch(err => console.error("خطا در دریافت داده‌ها:", err));
  }, []);

  if (!singleData) return <div className="custom-loading-box"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="100" height="30">
  <circle fill="#FF156D" stroke="#FF156D" stroke-width="2" r="8" cx="20" cy="30">
    <animate attributeName="cx" calcMode="spline" dur="2" values="20;180;180;20;20" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin="0"></animate>
  </circle>
  <circle fill="#FF156D" stroke="#FF156D" stroke-width="2" opacity=".8" r="8" cx="20" cy="30">
    <animate attributeName="cx" calcMode="spline" dur="2" values="20;180;180;20;20" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin="0.05"></animate>
  </circle>
  <circle fill="#FF156D" stroke="#FF156D" stroke-width="2" opacity=".6" r="8" cx="20" cy="30">
    <animate attributeName="cx" calcMode="spline" dur="2" values="20;180;180;20;20" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".1"></animate>
  </circle>
  <circle fill="#FF156D" stroke="#FF156D" stroke-width="2" opacity=".4" r="8" cx="20" cy="30">
    <animate attributeName="cx" calcMode="spline" dur="2" values="20;180;180;20;20" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".15"></animate>
  </circle>
  <circle fill="#FF156D" stroke="#FF156D" stroke-width="2" opacity=".2" r="8" cx="20" cy="30">
    <animate attributeName="cx" calcMode="spline" dur="2" values="20;180;180;20;20" keySplines="0 .1 .5 1;0 .1 .5 1;0 .1 .5 1;0 .1 .5 1" repeatCount="indefinite" begin=".2"></animate>
  </circle>
</svg>
</div>;

  return (
    <div className="portfolio-container" dir="rtl">
      <Helmet>
        <title>نمونه کار ها / نیوز فلو </title>
        <link rel="icon" type="image/jpeg" href="/7dac5e26-f0ae-456a-b917-7aa8ff62fef3.jpeg" />
      </Helmet>
      <div className="portfolio-grid">
        
        {singleData.portfolio?.map((item, i) => {
          const fileUrl = item.file_portfolio || item.file_portfoli;

          return (
            <div key={`port-${i}`} className="portfolio-card">
              
              <div className="portfolio-card-img-wrapper">
                {item.img_portfolio && (
                  <img 
                    src={getUrl(item.img_portfolio)} 
                    alt={item.ttile_portfolio || "portfolio"} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
                  />
                )}
              </div>


              <div className="portfolio-card-content">
                {item.text_portfolio && <span className="portfolio-badge">{item.text_portfolio}</span>}
                <h3 className="portfolio-card-title">{item.ttile_portfolio}</h3>


                {fileUrl && (
                  <a 
                    href={getUrl(fileUrl)}
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
          );
        })}

      </div>
    </div>
  );
}

export default Portfolio;