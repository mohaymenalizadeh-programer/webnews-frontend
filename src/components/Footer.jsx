import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTelegramPlane, FaWhatsapp, FaYoutube, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter, FaArrowUp } from 'react-icons/fa6';
import './Footer.css';

const API_BASE = 'http://127.0.0.1:8000';

function getImageUrl(path) {
  if (!path) return 'https://via.placeholder.com/50';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!cleanPath.startsWith('/media/')) {
    cleanPath = `/media${cleanPath}`;
  }
  
  return `${API_BASE}${cleanPath}`;
}

function Footer() {
  const [newsDay, setNewsDay] = useState([]);
  const [lifestyle, setLifestyle] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        if (res.data) {
          setNewsDay(res.data.newsoftheday || []);
          setLifestyle(res.data.lifestyle || []);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="site-footer" dir="rtl">
      <div className="footer-container">
        <div className="footer-col footer-col-about">
          <div className="footer-logo">
          <svg viewBox="0 0 100 100" width="80" height="80">
      <style>{`
        @keyframes pulse {
          0% { r: 10px; opacity: 1; }
          100% { r: 40px; opacity: 0; }
        }
        .wave {
          animation: pulse 1.5s infinite ease-out;
          transform-origin: center;
        }
        .wave2 {
          animation: pulse 1.5s infinite ease-out 0.5s;
          transform-origin: center;
        }
      `}</style>
      

      <circle className="wave" cx="50" cy="50" r="10" fill="none" stroke="#FF2E4C" strokeWidth="3" />
      <circle className="wave2" cx="50" cy="50" r="10" fill="none" stroke="#FF2E4C" strokeWidth="3" />
      

      <circle cx="50" cy="50" r="8" fill="#FF2E4C" />
    </svg>
            <span className="logo-text">نیوز فلو</span>
            <span className="logo-sub">قالب خبری و مجله ای </span>
          </div>
          <p className="footer-about-text">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
          </p>
        </div>

        <div className="footer-col footer-col-posts">
          <h3 className="footer-heading">اخبار روز</h3>
          <div className="footer-posts-list">
            {newsDay.map((item, index) => (
              <div 
                key={item.id || item.slug || index} 
                className="footer-post-item"
                onClick={() => handleNavigate('newsoftheday', item.slug)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={getImageUrl(item.img_ftheday)} 
                  alt={item.txt_news || "news"} 
                  className="post-thumb"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                />
                <span className="post-title">{item.txt_news}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-col footer-col-posts">
          <h3 className="footer-heading">سبک زندگی</h3>
          <div className="footer-posts-list">
            {lifestyle.map((item, index) => (
              <div 
                key={item.id || item.slug || index} 
                className="footer-post-item"
                onClick={() => handleNavigate('lifestyle', item.slug)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={getImageUrl(item.img_Lifestyle)} 
                  alt={item.begtxt || "lifestyle"} 
                  className="post-thumb"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                />
                <span className="post-title">{item.begtxt}</span>
              </div>
            ))}
          </div>
        </div>


        <div className="footer-col footer-col-symbol">
          <div className="symbol-box">
            <img src="/images/logo1 (1).png" alt="نماد اعتماد" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="social-links">
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaXTwitter /></a>
            <a href="#" className="social-icon"><FaYoutube /></a>
            <a href="#" className="social-icon"><FaWhatsapp /></a>
            <a href="#" className="social-icon"><FaTelegramPlane /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>کلیه حقوق این سایت محفوظ است | طراحی و توسعه توسط مهندس علیزاده</p>
      </div>

      <button className="scroll-to-top" onClick={scrollToTop} aria-label="برو بالا">
        <FaArrowUp />
      </button>
    </footer>
  );
}

export default Footer;