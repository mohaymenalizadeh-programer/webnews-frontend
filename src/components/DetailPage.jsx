import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './DetailPage.css';

const API_BASE = 'http://127.0.0.1:8000';

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
  if (!imgPath) return 'https://placehold.co/800x450?text=No+Image';
  if (imgPath.startsWith('http')) return imgPath;
  return `${API_BASE}/media/${imgPath}`;
};

const detectCategory = (item, defaultCat) => {
  if (item.cat) return item.cat;
  if (item.img_ftheday || item.txt_news || item.pagetxt_newsoftheday) return 'newsoftheday';
  if (item.img_Lifestyle || item.begtxt || item.pagetxt_newsLifestyle) return 'lifestyle';
  if (item.img_Decoration || item.text || item.pagetxt_newsDecoration) return 'decoration';
  if (item.img_Technology || item.matn || item.pagetxt_newsTechnology) return 'technology';
  if (item.img_Artculture || item.dodslg || item.pagetxt_newsArtculture) return 'artculture';
  return defaultCat;
};

function DetailPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [latestList, setLatestList] = useState([]);
  const [loading, setLoading] = useState(true);


  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [userImg, setUserImg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setNews(null);
    setSubmitMessage('');
    window.scrollTo(0, 0);

    let apiCategory = category;
    if (category === 'art-culture') apiCategory = 'artculture';


    const fetchMainNews = axios.get(`${API_BASE}/api/${apiCategory}/${slug}/`, { signal })
      .then(res => setNews(res.data))
      .catch(err => {
        if (!axios.isCancel(err)) console.error("خطا در دریافت خبر اصلی:", err);
      });


    const fetchList = axios.get(`${API_BASE}/api/list/`, { signal })
      .then(res => {
        const data = res.data;

        const combinedLatest = [
          ...(data.twonewsofday || []).map(i => ({ title: i.txt_news, img: i.img_ftheday, slug: i.slug, cat: 'newsoftheday' })),
          ...(data.twolifestyle || []).map(i => ({ title: i.begtxt, img: i.img_Lifestyle, slug: i.slug, cat: 'lifestyle' })),
          ...(data.twodecoration || []).map(i => ({ title: i.text, img: i.img_Decoration, slug: i.slug, cat: 'decoration' })),
          ...(data.twotechnology || []).map(i => ({ title: i.matn, img: i.img_Technology, slug: i.slug, cat: 'technology' })),
          ...(data.twoartculture || []).map(i => ({ title: i.dodslg, img: i.img_Artculture, slug: i.slug, cat: 'artculture' }))
        ];
        setLatestList(combinedLatest);

        let relatedKey = 'allnewsofday';
        if (category === 'lifestyle') relatedKey = 'lifestyle_archive';
        if (category === 'decoration') relatedKey = 'decoration_archive';
        if (category === 'technology') relatedKey = 'technology_archive';
        if (category === 'artculture' || category === 'art-culture') relatedKey = 'artculture_archive';

        const rawRelated = data[relatedKey] || data.allnewsofday || [];
        const filteredRelated = rawRelated.filter(item => item.slug !== slug);
        setRelatedList(filteredRelated.slice(0, 3));
      })
      .catch(err => {
        if (!axios.isCancel(err)) console.error("خطا در دریافت لیست جانبی:", err);
      });

   
    const fetchComments = axios.get(`${API_BASE}/api/comments/?slug=${slug}`, { signal })
      .then(res => {
        const data = res.data.results || res.data || [];
        setComments(data);
      })
      .catch(err => {
        if (!axios.isCancel(err)) console.error("خطا در دریافت نظرات:", err);
      });

    Promise.allSettled([fetchMainNews, fetchList, fetchComments]).then(() => {
      setLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, [category, slug]);

  const handleNavigate = (targetCat, targetSlug) => {
    if (!targetSlug) return;
    navigate(`/${targetCat}/${targetSlug}`);
  };


  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData();
    formData.append('news_slug', slug);
    formData.append('coment_usernameandlastname', authorName);
    formData.append('coment_title', commentText);
    if (userImg) {
      formData.append('imguser', userImg);
    }

    axios.post(`${API_BASE}/api/comments/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        setSubmitMessage('نظر شما با موفقیت ثبت شد و پس از دقایق اینده  تایید مدیریت نمایش داده خواهد شد.');
        setAuthorName('');
        setCommentText('');
        setUserImg(null);
        setSubmitting(false);
      })
      .catch(err => {
        console.error("خطا در ارسال نظر:", err);
        setSubmitMessage('خطایی در ثبت نظر رخ داد. لطفاً دوباره تلاش کنید.');
        setSubmitting(false);
      });
  };

  if (loading) {
    return <div className="det-loading">در حال بارگذاری اطلاعات...</div>;
  }

  if (!news) {
    return <div className="det-loading">خبر مورد نظر یافت نشد.</div>;
  }

  const title = news.dodslg || news.txt_news || news.begtxt || news.text || news.matn ||  'بدون عنوان';
  const shortTxt = news.pagetxt_newsArtculture || news.pagetxt_newsoftheday || news.pagetxt_newsLifestyle || news.pagetxt_newsDecoration || news.pagetxt_newsTechnology || '';
  const longTxt = news.page_newsArtculture_title || news.Artculture_title || news.page_newsoftheday_title || news.longtitle || news.page_newsLifestyle_title || news.page_newsDecoration_title || news.page_newsTechnology_title || news.matn || news.title || '';
  const image = news.img_Artculture || news.img_ftheday || news.img_Lifestyle || news.img_Decoration || news.img_Technology;


  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "image": [getImgUrl(image)],
    "datePublished": news.publish_date,
    "description": shortTxt || title
  };

  return (
    <div key={`${category}-${slug}`} className="det-page-wrapper" dir="rtl">

      <Helmet>
        <title>{title} | مجله خبری ما</title>
        <meta name="description" content={shortTxt || title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={shortTxt || title} />
        <meta property="og:image" content={getImgUrl(image)} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://yoursite.com/${category}/${slug}`} />
      </Helmet>


      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>

      <div className="det-container">
        <div className="det-main-layout">

          <div className="det-article-section">
            <div className="det-main-card">
              <div className="det-header-box">
                <h1>{title}</h1>
              </div>

              <div className="det-media-wrapper">
                <div className="det-meta-strip">
                  <span className="det-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    {news.views || 0} بازدید
                  </span>
                  <span className="det-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {getRelativeTime(news.publish_date)}
                  </span>
                </div>
                <img 
                  src={getImgUrl(image)} 
                  alt={title} 
                  className="det-hero-img" 
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://placehold.co/800x450?text=No+Image'; }}
                />
              </div>

              {shortTxt && (
                <div className="det-short-text-box">
                  <p>{shortTxt}</p>
                </div>
              )}

              {longTxt && (
                <div className="det-long-text-box">
                  <p>{longTxt}</p>
                </div>
              )}
            </div>


            <div className="det-comments-section">
              <div className="det-section-title">
                <span className="det-red-square"></span>
                <h3>نظرات کاربران ({comments.length})</h3>
              </div>


              <div className="det-comment-form-box">
                <h4>دیدگاه خود را بنویسید</h4>
                {submitMessage && (
                  <div className={`det-comment-alert ${submitMessage.includes('موفقیت') ? 'success' : 'error'}`}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleCommentSubmit} className="det-comment-form">
                  <div className="det-form-group">
                    <label>نام و نام خانوادگی *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="نام خود را وارد کنید"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>

                  <div className="det-form-group">
                    <label>متن نظر *</label>
                    <textarea 
                      rows="4" 
                      required 
                      placeholder="دیدگاه خود را اینجا بنویسید..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="det-form-group">
                    <label>تصویر پروفایل (اختیاری)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setUserImg(e.target.files[0])}
                    />
                  </div>

                  <button type="submit" className="det-comment-submit-btn" disabled={submitting}>
                    {submitting ? 'در حال ارسال...' : 'ارسال نظر'}
                  </button>
                </form>
              </div>


              <div className="det-comments-list">
                {comments.length === 0 ? (
                  <p className="det-no-comments">هنوز نظری برای این خبر ثبت نشده است.</p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={comment.id || index} className="det-comment-card">
                      <div className="det-comment-avatar">
                        <img 
                          src={comment.imguser ? getImgUrl(comment.imguser) : 'https://placehold.co/60x60?text=User'} 
                          alt={comment.coment_usernameandlastname}
                          loading="lazy"
                          onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=User'; }}
                        />
                      </div>
                      <div className="det-comment-body">
                        <div className="det-comment-header">
                          <span className="det-comment-author">{comment.coment_usernameandlastname}</span>
                          <span className="det-comment-date">{getRelativeTime(comment.publish_date)}</span>
                        </div>
                        <p className="det-comment-text">{comment.coment_title}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>


            <div className="det-related-section">
              <div className="det-section-title">
                <span className="det-red-square"></span>
                <h3>اخبار مرتبط</h3>
              </div>
              <div className="det-related-grid">
                {relatedList.map((item, idx) => {
                  const relTitle = item.dodslg || item.txt_news || item.begtxt || item.text || item.matn;
                  const relImg = item.img_Artculture || item.img_ftheday || item.img_Lifestyle || item.img_Decoration || item.img_Technology;
                  const itemCategory = detectCategory(item, category);
                  
                  return (
                    <div 
                      key={idx} 
                      className="det-related-card" 
                      onClick={() => handleNavigate(itemCategory, item.slug)}
                    >
                      <img 
                        src={getImgUrl(relImg)} 
                        alt={relTitle || 'خبر مرتبط'} 
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x180?text=No+Image'; }}
                      />
                      <h4>{relTitle}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>


          <div className="det-sidebar">
            <div className="det-widget">
              <div className="det-widget-header">
                <span className="det-red-square"></span>
                <h3>جدیدترین مطالب</h3>
              </div>
              <div className="det-latest-list">
                {latestList.map((item, index) => (
                  <div key={index} className="det-latest-item" onClick={() => handleNavigate(item.cat, item.slug)}>
                    <img 
                      src={getImgUrl(item.img)} 
                      alt="thumb" 
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                    />
                    <p>{item.title}</p>
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

export default DetailPage;