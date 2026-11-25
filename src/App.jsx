import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const BASE = import.meta.env.BASE_URL || '/';

const assetUrl = (relativePath) => {
  const clean = String(relativePath || '').replace(/^\/+/, '');
  return `${BASE}${clean}`;
};

const REGIONS = [
  {
    id: 'seongsu',
    label: '성수',
    fullRegion: '서울특별시 성동구 성수동2가',
    timeSlot: '아침',
    temp: 4,
    feelsLike: 1,
    condition: '맑음',
    high: 7,
    low: -1,
    humidity: 55,
    wind: '2.1 m/s',
    rainProb: '10%',
    updatedAt: '11. 24. 오후 06:00 기준',
    weatherPayload: {
      아침: { temp: 4, feelsLike: 1, condition: '맑음', high: 7, low: -1, humidity: 55, wind: '2.1 m/s', rainProb: '10%' },
      낮: { temp: 9, feelsLike: 8, condition: '맑음', high: 9, low: 2, humidity: 45, wind: '1.9 m/s', rainProb: '10%' },
      저녁: { temp: 3, feelsLike: 0, condition: '맑음', high: 6, low: -2, humidity: 60, wind: '2.4 m/s', rainProb: '20%' },
    },
    streetStyles: [
      { id: 's1', name: '롱패딩', pct: 38, badgePct: 38, img: 'assets/Img/padding.png' },
      { id: 's2', name: '숏패딩', pct: 27, badgePct: 27, img: 'assets/Img/jacket.png' },
      { id: 's3', name: '코트', pct: 21, badgePct: 21, img: 'assets/Img/coat.png' },
      { id: 's4', name: '니트', pct: 14, badgePct: 14, img: 'assets/Img/long-sleeve.png' },
    ],
    outfit: {
      title: '오늘의 추천',
      comment: '오늘 아침은 쌀쌀하니 니트에 코트를 걸쳐보세요.',
      img: 'assets/Img/coat.png',
    },
  },
  {
    id: 'seogyo',
    label: '서교',
    fullRegion: '서울특별시 마포구 서교동',
    timeSlot: '낮',
    temp: 24,
    feelsLike: 24,
    condition: '맑음',
    high: 26,
    low: 15,
    humidity: 48,
    wind: '1.5 m/s',
    rainProb: '10%',
    updatedAt: '11. 24. 오후 06:00 기준',
    weatherPayload: {
      아침: { temp: 16, feelsLike: 16, condition: '맑음', high: 18, low: 14, humidity: 58, wind: '1.4 m/s', rainProb: '10%' },
      낮: { temp: 24, feelsLike: 24, condition: '맑음', high: 26, low: 15, humidity: 48, wind: '1.5 m/s', rainProb: '10%' },
      저녁: { temp: 18, feelsLike: 18, condition: '맑음', high: 21, low: 15, humidity: 54, wind: '1.7 m/s', rainProb: '10%' },
    },
    streetStyles: [
      { id: 'w1', name: '긴팔/셔츠', pct: 42, badgePct: 42, img: 'assets/Img/long-sleeve.png' },
      { id: 'w2', name: '반팔', pct: 28, badgePct: 28, img: 'assets/Img/short-sleeve.png' },
      { id: 'w3', name: '가디건', pct: 18, badgePct: 18, img: 'assets/Img/jacket.png' },
      { id: 'w4', name: '니트', pct: 12, badgePct: 12, img: 'assets/Img/coat.png' },
    ],
    outfit: {
      title: '오늘의 추천',
      comment: '낮에는 포근하니 얇은 긴팔이나 가벼운 아우터 코디가 좋아요.',
      img: 'assets/Img/long-sleeve.png',
    },
  },
];

const INITIAL_REVIEWS = [
  { id: 1, author: '주주', team: '팀 추워', tag: '더워요', text: '' },
  { id: 2, author: '주주', team: '팀 더워', tag: '딱 좋아요', text: 'ㅇㅇㅇㅇ' },
  { id: 3, author: '주주', team: '팀 더워', tag: '딱 좋아요', text: 'dd' },
];

const DEFAULT_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    name: '울 블렌드 발마칸 코트',
    comment: '오늘 아침은 쌀쌀하니 니트에 코트를 걸쳐보세요.',
    img: 'assets/Img/coat.png',
  },
  {
    id: 'rec-2',
    name: '소프트 라운드 니트 가디건',
    comment: '간절기 체온 조절용으로 가볍게 걸치기 좋아요.',
    img: 'assets/Img/jacket.png',
  },
  {
    id: 'rec-3',
    name: '데일리 코튼 롱슬리브 셔츠',
    comment: '단정하게 입기 좋은 긴팔 상의 추천이에요.',
    img: 'assets/Img/long-sleeve.png',
  },
  {
    id: 'rec-4',
    name: '헤비 숏패딩 점퍼',
    comment: '기온이 떨어질 때 따뜻하게 입기 좋은 아우터예요.',
    img: 'assets/Img/padding.png',
  },
];

export default function App() {
  const [tab, setTab] = useState('home'); // home | outfit | my
  const [regionId, setRegionId] = useState('seongsu');
  const [timeSlot, setTimeSlot] = useState('아침');
  const [nickname, setNickname] = useState(() => localStorage.getItem('wearther_nickname') || '주주');
  const [team, setTeam] = useState('팀 추워');
  const [closetInput, setClosetInput] = useState('니트, 코트');
  const [feedback, setFeedback] = useState('딱 지금 정도로');
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [reviewInput, setReviewInput] = useState('');
  const [reviewTag, setReviewTag] = useState('딱 좋아요');
  const [rpcData, setRpcData] = useState([]);

  useEffect(() => {
    localStorage.setItem('wearther_nickname', nickname);
  }, [nickname]);

  const region = useMemo(
    () => REGIONS.find((r) => r.id === regionId) || REGIONS[0],
    [regionId]
  );

  const slotWeather = useMemo(() => {
    return (
      region.weatherPayload[timeSlot] || {
        temp: region.temp,
        feelsLike: region.feelsLike,
        condition: region.condition,
        high: region.high,
        low: region.low,
        humidity: region.humidity,
        wind: region.wind,
        rainProb: region.rainProb,
      }
    );
  }, [region, timeSlot]);

  useEffect(() => {
    let active = true;
    supabase
      .rpc('get_recommendations_by_weather', {
        p_region: region.fullRegion,
        p_weather: region.weatherPayload,
      })
      .then(({ data, error }) => {
        if (!active || error) return;
        if (Array.isArray(data)) setRpcData(data);
        else if (Array.isArray(data?.items)) setRpcData(data.items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [region]);

  const recommendations = useMemo(() => {
    const source = rpcData.length > 0 ? rpcData : DEFAULT_RECOMMENDATIONS;
    const mapped = source.map((item, idx) => ({
      id: item.id || `rec-${idx}`,
      name: item.name || item.title || '추천 의류',
      comment: item.comment || item.description || region.outfit.comment,
      img: item.img || item.image || 'assets/Img/coat.png',
    }));

    const keyword = closetInput.trim();
    if (!keyword) return mapped;
    return [...mapped].sort((a, b) => {
      const aMatch = a.name.includes(keyword) ? -1 : 0;
      const bMatch = b.name.includes(keyword) ? -1 : 0;
      return aMatch - bMatch;
    });
  }, [rpcData, closetInput, region.outfit.comment]);

  const handleAddReview = (e) => {
    e.preventDefault();
    const trimmed = reviewInput.trim();
    setReviews((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: nickname || '주주',
        team,
        tag: reviewTag,
        text: trimmed,
      },
    ]);
    setReviewInput('');
  };

  return (
    <div className="app-bg">
      <div className="mobile-wrap">
        {tab === 'home' && (
          <div className="page-scroll">
            <header className="top-bar">
              <span className="brand-logo">옷늘날씨</span>
              <select
                aria-label="시간대 선택"
                className="slot-select"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="아침">아침</option>
                <option value="낮">낮</option>
                <option value="저녁">저녁</option>
              </select>
            </header>

            <section className="weather-box">
              <div className="weather-top">
                <div>
                  <button
                    type="button"
                    className="region-btn"
                    onClick={() =>
                      setRegionId((prev) => (prev === 'seongsu' ? 'seogyo' : 'seongsu'))
                    }
                  >
                    ● {region.label}
                  </button>
                  <div className="big-temp">{slotWeather.temp}°C</div>
                  <div className="sub-cond">
                    {slotWeather.condition} · 체감 {slotWeather.feelsLike}°C
                  </div>
                </div>
                <div className="sun-circle" aria-hidden="true" />
              </div>

              <div className="weather-divider" />

              <div className="weather-metrics">
                <div>
                  <strong>{slotWeather.high}° / {slotWeather.low}°</strong>
                  <span>최고 / 최저</span>
                </div>
                <div>
                  <strong>{slotWeather.humidity}</strong>
                  <span>습도</span>
                </div>
                <div>
                  <strong>{slotWeather.wind}</strong>
                  <span>풍속</span>
                </div>
                <div>
                  <strong>{slotWeather.rainProb}</strong>
                  <span>강수확률</span>
                </div>
              </div>
            </section>

            <section className="block-section">
              <div className="section-title-row">
                <h2>지금 이 거리의 스타일</h2>
                <span className="updated-text">갱신 · {region.updatedAt}</span>
              </div>

              <div className="style-hscroll">
                {region.streetStyles.map((st) => (
                  <div key={st.id} className="style-card">
                    <div className="style-thumb-wrap">
                      <img src={assetUrl(st.img)} alt={st.name} className="style-thumb" />
                      <span className="style-badge">{st.badgePct}%</span>
                    </div>
                    <div className="style-label-row">
                      <span>{st.name}</span>
                      <strong>{st.pct}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="block-section">
              <div className="section-title-row">
                <h2>오늘은 이렇게 입어보세요</h2>
                <button
                  type="button"
                  className="detail-link-btn"
                  onClick={() => setTab('outfit')}
                >
                  자세히 보기
                </button>
              </div>

              <div className="feedback-strip">
                {['더 시원하게', '딱 지금 정도로', '더 따뜻하게'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`fb-btn ${feedback === opt ? 'active' : ''}`}
                    onClick={() => setFeedback(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div
                className="outfit-hero-card"
                onClick={() => setTab('outfit')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setTab('outfit');
                }}
              >
                <img src={assetUrl(region.outfit.img)} alt={region.outfit.title} />
              </div>

              <div className="rec-cards-list">
                {recommendations.map((item) => (
                  <div key={item.id} className="rec-row-card">
                    <img src={assetUrl(item.img)} alt={item.name} className="rec-row-img" />
                    <div className="rec-row-meta">
                      <div className="rec-row-name">{item.name}</div>
                      <div className="rec-row-comment">{item.comment}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === 'outfit' && (
          <div className="page-scroll">
            <header className="top-bar">
              <span className="brand-logo">옷늘날씨</span>
            </header>

            <div className="outfit-detail-photo">
              <img src={assetUrl(region.outfit.img)} alt={region.outfit.title} />
            </div>

            <section className="outfit-detail-body">
              <h2>오늘의 추천</h2>
              <p className="outfit-comment-text">{region.outfit.comment}</p>

              <div className="review-list">
                {reviews.map((rv) => (
                  <div key={rv.id} className="review-item">
                    <div className="avatar-circle" aria-hidden="true" />
                    <div>
                      <div className="review-meta">
                        {rv.author} · {rv.team} · {rv.tag}
                      </div>
                      {rv.text && <div className="review-content">{rv.text}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddReview} className="review-form">
                <div className="review-tag-row">
                  {['추워요', '딱 좋아요', '더워요'].map((tg) => (
                    <button
                      key={tg}
                      type="button"
                      className={`tag-chip ${reviewTag === tg ? 'active' : ''}`}
                      onClick={() => setReviewTag(tg)}
                    >
                      {tg}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="review-input"
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="리뷰를 입력하세요"
                />
                <button type="submit" className="review-submit-btn">
                  리뷰 작성하기
                </button>
              </form>
            </section>
          </div>
        )}

        {tab === 'my' && (
          <div className="page-scroll my-page">
            <div className="my-top-title">MY</div>

            <div className="my-profile-block">
              <div className="my-avatar-big" aria-hidden="true" />
              <div className="my-name">{nickname}</div>
              <div className="my-team">{team}</div>
            </div>

            <div className="my-menu-list">
              <div className="my-menu-row">
                <span>내 정보 관리</span>
                <span>&gt;</span>
              </div>
              <div className="my-menu-edit">
                <label className="my-field-label">닉네임</label>
                <input
                  type="text"
                  className="my-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <label className="my-field-label">체질 그룹</label>
                <select
                  className="my-input"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                >
                  <option value="팀 추워">팀 추워</option>
                  <option value="팀 더워">팀 더워</option>
                  <option value="팀 딱좋아">팀 딱좋아</option>
                </select>
                <label className="my-field-label">내 옷장</label>
                <input
                  type="text"
                  className="my-input"
                  value={closetInput}
                  onChange={(e) => setClosetInput(e.target.value)}
                />
              </div>
              <div className="my-menu-row">
                <span>작성한 리뷰 {reviews.length}개</span>
                <span>&gt;</span>
              </div>
            </div>

            <div className="my-account-actions">
              <button type="button" className="logout-btn">
                로그아웃
              </button>
              <button type="button" className="withdraw-btn">
                회원탈퇴
              </button>
            </div>
          </div>
        )}

        <nav className="bottom-nav" aria-label="하단 내비게이션">
          <button
            type="button"
            className={`nav-item ${tab === 'home' ? 'active' : ''}`}
            onClick={() => setTab('home')}
          >
            <span className="nav-icon">🏠</span>
            <span>홈</span>
          </button>
          <button
            type="button"
            className={`nav-item ${tab === 'outfit' ? 'active' : ''}`}
            onClick={() => setTab('outfit')}
          >
            <span className="nav-icon">👕</span>
            <span>오늘의 코디</span>
          </button>
          <button
            type="button"
            className={`nav-item ${tab === 'my' ? 'active' : ''}`}
            onClick={() => setTab('my')}
          >
            <span className="nav-icon">👤</span>
            <span>마이</span>
          </button>
        </nav>
      </div>
    </div>
  );
}