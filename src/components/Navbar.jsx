import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { Helmet } from 'react-helmet-async';

const API_BASE = 'https://webflow.pythonanywhere.com';

const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const MoonIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>;
const SunIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
const BurgerIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>;

function Navbar({ onSelectNewsOfDay }) {
  const navigate = useNavigate();
  const [sliderTexts, setSliderTexts] = useState([]);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  const navLinks = [
    { id: 2, label: 'تکنولوژی', path: '/technology' },
    { id: 3, label: 'سبک زندگی', path: '/lifestyle' },
    { id: 4, label: 'دکوراسیون', path: '/decoration' },
    { id: 5, label: 'فرهنگ و هنر', path: '/artculture' },
    { id: 6, label: 'اخبار روز', path: '/news-of-day', isNewsOfDay: true },
    { id: 7, label: 'نمونه کار ها', path: '/Portfolio' },
  ];

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        if (res.data?.slidertxt) setSliderTexts(res.data.slidertxt);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (sliderTexts.length < 2) return;
    const timer = setInterval(() => setIndex(prev => (prev + 1) % sliderTexts.length), 3500);
    return () => clearInterval(timer);
  }, [sliderTexts]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;

    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        const data = res.data || {};

        const allNews = [
          ...(data.allnewsofday || []).map(i => ({ shortText: String(i.txt_news || i.title_news || ''), slug: i.slug, cat: 'newsoftheday' })),
          ...(data.alllifestyle || []).map(i => ({ shortText: String(i.begtxt || i.longtitle || ''), slug: i.slug, cat: 'lifestyle' })),
          ...(data.alldecoration || []).map(i => ({ shortText: String(i.text || i.title || ''), slug: i.slug, cat: 'decoration' })),
          ...(data.alltechnology || []).map(i => ({ shortText: String(i.matn || i.explanation || ''), slug: i.slug, cat: 'technology' })),
          ...(data.allartculture || []).map(i => ({ shortText: String(i.dodslg || i.Artculture_title || ''), slug: i.slug, cat: 'artculture' })),
        ];

        const filtered = allNews.filter(i => 
          i.shortText && i.shortText.toLowerCase().includes(term) && i.slug
        );

        setResults(filtered);
        setSearched(true);
      })
      .catch(err => {
        console.error("خطا در جستجو:", err);
        setResults([]);
        setSearched(true);
      });
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div dir="rtl" className="navbar-wrapper">
      <Helmet>
        <title>نیوز فلو</title>
        <link rel="icon" type="image/jpeg" href="/7dac5e26-f0ae-456a-b917-7aa8ff62fef3.jpeg" />
      </Helmet>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="news-badge">
            <span className="dot"></span>
            <span>جدیدترین‌ها :</span>
          </div>
          <div className="news-slider">
            {sliderTexts.length > 0 && sliderTexts[index] && (
              <div className="news-item">
                <p>{sliderTexts[index].text_slider}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="navbar-inner">
          <button className="icon-btn burger-btn" onClick={() => setMenuOpen(true)} aria-label="منو"><BurgerIcon /></button>
          

          <a className="logo" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="logo-row">
            <span className="logo-title">نیوز         فلو</span>
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
              <div className="logo-mark">
              </div>
            </div>
            <span className="logo-sub">سایت خبری و مجله ای </span>
          </a>

          <nav className="nav-links">
            {navLinks.map(item => (
              <a key={item.id} href={item.path} onClick={(e) => {
                e.preventDefault();
                item.isNewsOfDay ? (onSelectNewsOfDay ? onSelectNewsOfDay() : navigate('/news-of-day')) : navigate(item.path);
              }}>{item.label}</a>
            ))}
          </nav>

          <div className="icons">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="جستجو"><SearchIcon /></button>
            <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="حالت شب">{dark ? <SunIcon /> : <MoonIcon />}</button>
          </div>
        </div>
      </header>

      <div className={`search-modal-container ${searchOpen ? 'open' : ''}`} onClick={closeSearch}>
        <div className="search-modal-card" onClick={e => e.stopPropagation()}>
          <button className="search-close-btn" onClick={closeSearch}><CloseIcon /></button>
          <h3>جستجو در سایت</h3>
          
          <form className="search-input-wrapper" onSubmit={handleSearch}>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="جستجو کنید..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit-btn"><SearchIcon /></button>
          </form>

          <div style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {searched && results.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>خبری پیدا نشد.</p>}
            {results.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => { closeSearch(); navigate(`/${item.cat}/${item.slug}`); }}
                style={{ padding: '8px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
              >
                <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>{item.shortText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`drawer-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <aside className={`drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span>منو</span>
          <button className="close-drawer-btn" onClick={() => setMenuOpen(false)}><CloseIcon /></button>
        </div>
        <nav className="drawer-links">
          {navLinks.map(item => (
            <a key={item.id} href={item.path} onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              item.isNewsOfDay ? (onSelectNewsOfDay ? onSelectNewsOfDay() : navigate('/news-of-day')) : navigate(item.path);
            }}>{item.label}</a>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default Navbar;