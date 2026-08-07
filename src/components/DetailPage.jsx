import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './DetailPage.css';

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

const getImgUrl = (path) => {
  if (!path) return 'https://placehold.co/800x450?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/media/${path.replace(/.*\/media\//, '')}`;
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
    let isMounted = true;
    setLoading(true);
    setNews(null);
    setSubmitMessage('');
    window.scrollTo(0, 0);

    let apiCategory = category === 'art-culture' ? 'artculture' : category;

    // جستجوی هوشمند خبر در تمام دسته‌های ممکن API در صورت 404
    const fetchNewsData = async () => {
      const categoriesToTry = Array.from(new Set([
        apiCategory,
        'newsoftheday',
        'lifestyle',
        'decoration',
        'technology',
        'artculture'
      ]));

      let foundData = null;

      for (const cat of categoriesToTry) {
        try {
          const res = await axios.get(`${API_BASE}/api/${cat}/${slug}/`);
          if (res.data && (res.data.slug || res.data.title || res.data.dodslg || res.data.txt_news)) {
            foundData = res.data;
            break;
          }
        } catch (e) {
          // ادامه جستجو در دسته بعدی
        }
      }

      if (isMounted) {
        setNews(foundData);
      }
    };

    fetchNewsData();


    axios.get(`${API_BASE}/api/list/`)
      .then(res => {
        if (!isMounted) return;
        const data = res.data;

        const combinedLatest = [
          ...(data.twonewsofday || []).map(i => ({ title: i.txt_news || i.txt_news, img: i.img_ftheday, slug: i.slug, cat: 'newsoftheday' })),
          ...(data.twolifestyle || []).map(i => ({ title: i.begtxt || i.begtxt, img: i.img_Lifestyle, slug: i.slug, cat: 'lifestyle' })),
          ...(data.twodecoration || []).map(i => ({ title: i.text || i.text, img: i.img_Decoration, slug: i.slug, cat: 'decoration' })),
          ...(data.twotechnology || []).map(i => ({ title: i.matn || i.matn, img: i.img_Technology, slug: i.slug, cat: 'technology' })),
          ...(data.twoartculture || []).map(i => ({ title: i.dodslg || i.dodslg, img: i.img_Artculture, slug: i.slug, cat: 'artculture' }))
        ];
        setLatestList(combinedLatest);

        let relatedKey = 'allnewsofday';
        let defaultCat = 'newsoftheday';

        if (category === 'lifestyle') {
          relatedKey = 'lifestyle_archive';
          defaultCat = 'lifestyle';
        } else if (category === 'decoration') {
          relatedKey = 'decoration_archive';
          defaultCat = 'decoration';
        } else if (category === 'technology') {
          relatedKey = 'technology_archive';
          defaultCat = 'technology';
        } else if (category === 'artculture' || category === 'art-culture') {
          relatedKey = 'artculture_archive';
          defaultCat = 'artculture';
        }

        const rawRelated = data[relatedKey] || data.allnewsofday || [];
        const filteredRelated = rawRelated
          .filter(item => item.slug !== slug)
          .map(item => ({
            ...item,
            cat: item.cat || defaultCat
          }));

        setRelatedList(filteredRelated.slice(0, 3));
      })
      .catch(err => console.error("خطا در دریافت لیست:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // دریافت نظرات
    axios.get(`${API_BASE}/api/comments/?slug=${slug}`)
      .then(res => {
        if (isMounted) setComments(res.data.results || res.data || []);
      })
      .catch(err => console.error("خطا در دریافت نظرات:", err));

    return () => {
      isMounted = false;
    };
  }, [category, slug]);

  const handleNavigate = (targetCat, targetSlug) => {
    if (!targetSlug) return;
    const cat = targetCat || category || 'newsoftheday';
    navigate(`/${cat}/${targetSlug}`);
    window.scrollTo(0, 0);
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
    if (userImg) formData.append('imguser', userImg);

    axios.post(`${API_BASE}/api/comments/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        setSubmitMessage('نظر شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده خواهد شد.');
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

  if (loading) return     <div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    margin: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  }}
>
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="35"
      cy="35"
      r="27"
      fill="none"
      stroke="#ff156d"
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray="42 130"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 35 35"
        to="360 35 35"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
</div>;
  if (!news) return <div className="det-loading">خبر مورد نظر یافت نشد.</div>;

  const title = news.dodslg || news.txt_news || news.begtxt || news.text || news.matn || news.title || news.Artculture_title || 'بدون عنوان';
  const shortTxt = news.pagetxt_newsArtculture || news.pagetxt_newsoftheday || news.pagetxt_newsLifestyle || news.pagetxt_newsDecoration || news.pagetxt_newsTechnology || '';
  const longTxt = news.page_newsArtculture_title || news.pagetxt_newsArtculture || news.page_newsoftheday_title || news.begtxt || news.page_newsLifestyle_title || news.page_newsDecoration_title || news.page_newsTechnology_title || news.pagetxt_newsTechnology || news.pagetxt_newsDecoration || '';
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
        <link rel="icon" type="image/jpeg" href="/7dac5e26-f0ae-456a-b917-7aa8ff62fef3.jpeg" />
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg>
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
                  const relTitle = item.Artculture_title || item.title_news || item.longtitle || item.title || item.matn || item.dodslg || item.txt_news || item.begtxt || item.text ;
                  const relImg = item.img_Artculture || item.img_ftheday || item.img_Lifestyle || item.img_Decoration || item.img_Technology;
                  
                  return (
                    <div 
                      key={idx} 
                      className="det-related-card" 
                      onClick={() => handleNavigate(item.cat, item.slug)}
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