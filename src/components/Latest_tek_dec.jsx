import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Latest_tek_dec.css';

const API_BASE = 'https://webflow.pythonanywhere.com';

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
  return `${Math.floor(diffInDays / 30)} ماه پیش`;
}

function NewsHub() {
  const [listData, setListData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/list/`)
      .then(res => setListData(res.data))
      .catch(err => console.error(err));
  }, []);

  const registerView = (category, slug) => {
    if (!slug) return;
    navigate(`/${category}/${slug}`);
  };

  if (!listData) return <div>در حال بارگذاری...</div>;

  return (
    <div className='nh-srls' dir="rtl">
      <div>
        <h2 className="nh-title-lifestyle">سبک زندگی</h2>

        <div className="nh-first-div">
          {listData.finishtechnology_Last?.map((item, index) => (
            <div key={index} className="nh-news-card" onClick={() => registerView('lifestyle', item.slug)}>
              <img className='nh-news-cardimglong' src={item.img_Lifestyle} alt="img" />
              
              <div className='nh-txtitems'>
                <h3>{item.begtxt}</h3>
                <div>
                  <span>{getRelativeTime(item.publish_date)}</span>
                  <span>{item.views || 0} بازدید</span>
                </div>
              </div>
              <p className="nh-card-tag nh-tag-green">سبک زندگی</p>
            </div>
          ))}
        </div>

        <div className="nh-second-div">
          {listData.finishtechnology_Last_smallbox?.map((item, index) => (
            <div key={index} className="nh-news-cardtwo" onClick={() => registerView('lifestyle', item.slug)}>
              <img className='nh-imgsmall' src={item.img_Lifestyle} alt="img" />
              <div className='nh-itemcard'>
                <h3>{item.begtxt}</h3>
                <div className='nh-viewandtimer'>
                  <span>{getRelativeTime(item.publish_date)}</span>
                  <span>{item.views || 0} بازدید</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="nh-title-decoration">دکوراسیون</h2>

        <div className="nh-first-div">
          {listData.ahsddecoration_Last?.map((item, index) => (
            <div key={index} className="nh-news-card" onClick={() => registerView('decoration', item.slug)}>
              <img className='nh-news-cardimglong' src={item.img_Decoration} alt="img" />
              
              <div className='nh-txtitems'>
                <h3>{item.text}</h3>
                <div>
                  <span>{getRelativeTime(item.publish_date)}</span>
                  <span>{item.views || 0} بازدید</span>
                </div>
              </div>
              <p className="nh-card-tag nh-tag-blue">دکوراسیون</p>
            </div>
          ))}
        </div>

        <div className="nh-second-div">
          {listData.ahsddecoration_Lastsmalltwos?.map((item, index) => (
            <div key={index} className="nh-news-cardtwo" onClick={() => registerView('decoration', item.slug)}>
              <img className='nh-imgsmall' src={item.img_Decoration} alt="img" />
              <div className='nh-itemcard'>
                <h3>{item.text}</h3>
                <div className='nh-viewandtimer'>
                  <span>{getRelativeTime(item.publish_date)}</span>
                  <span>{item.views || 0} بازدید</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsHub;