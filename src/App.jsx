import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const BASE = import.meta.env.BASE_URL || '/';

const assetUrl = (relativePath) => {
  const clean = String(relativePath || '').replace(/^\/+/, '');
  return `${BASE}${clean}`;
};

const REGION_OPTIONS = [
  {
    id: 'seongsu',
    label: '성수',
    sido: '서울특별시',
    sigungu: '성동구',
    dong: '성수동2가',
    zone: '서울동권',
    fullRegion: '서울특별시 성동구 성수동2가',
    updatedAt: '11. 24. 오후 06:00 기준',
    weatherPayload: {
      아침: {
        temp: 4,
        feelsLike: 1,
        condition: '맑음',
        high: 7,
        low: -1,
        humidity: '55%',
        wind: '2.1 m/s',
        rainProb: '10%',
      },
      낮: {
        temp: 11,
        feelsLike: 10,
        condition: '맑음',
        high: 12,
        low: 2,
        humidity: '45%',
        wind: '1.8 m/s',
        rainProb: '10%',
      },
      저녁: {
        temp: 3,
        feelsLike: 0,
        condition: '맑음',
        high: 6,
        low: -2,
        humidity: '60%',
        wind: '2.4 m/s',
        rainProb: '20%',
      },
    },
    streetStyles: [
      { id: 'st-1', name: '롱패딩', pct: 38, img: 'assets/Img/padding.png' },
      { id: 'st-2', name: '숏패딩', pct: 27, img: 'assets/Img/jacket.png' },
      { id: 'st-3', name: '코트', pct: 21, img: 'assets/Img/coat.png' },
      { id: 'st-4', name: '니트', pct: 14, img: 'assets/Img/long-sleeve.png' },
    ],
    outfitByTeam: {
      '팀 추워': {
        title: '오늘의 추천 코디',
        comment: '오늘 성수 아침은 쌀쌀하니 기모 이너와 도톰한 코트·패딩으로 따뜻하게 입어보세요.',
        img: 'assets/Img/coat.png',
      },
      '팀 딱좋아': {
        title: '오늘의 추천 코디',
        comment: '기본 니트에 코트나 자켓을 걸치면 출근길·외출 시 딱 알맞은 체온을 유지할 수 있어요.',
        img: 'assets/Img/jacket.png',
      },
      '팀 더워': {
        title: '오늘의 추천 코디',
        comment: '실내외 온도 차가 크니 통기성 좋은 상의에 탈착하기 쉬운 가벼운 아우터를 매치해보세요.',
        img: 'assets/Img/long-sleeve.png',
      },
    },
  },
  {
    id: 'seogyo',
    label: '서교',
    sido: '서울특별시',
    sigungu: '마포구',
    dong: '서교동',
    zone: '서울서권',
    fullRegion: '서울특별시 마포구 서교동',
    updatedAt: '11. 24. 오후 06:00 기준',
    weatherPayload: {
      아침: {
        temp: 16,
        feelsLike: 16,
        condition: '맑음',
        high: 24,
        low: 15,
        humidity: '58%',
        wind: '1.4 m/s',
        rainProb: '10%',
      },
      낮: {
        temp: 24,
        feelsLike: 24,
        condition: '맑음',
        high: 26,
        low: 15,
        humidity: '48%',
        wind: '1.5 m/s',
        rainProb: '10%',
      },
      저녁: {
        temp: 18,
        feelsLike: 18,
        condition: '맑음',
        high: 21,
        low: 15,
        humidity: '54%',
        wind: '1.7 m/s',
        rainProb: '10%',
      },
    },
    streetStyles: [
      { id: 'sg-1', name: '긴팔/셔츠', pct: 42, img: 'assets/Img/long-sleeve.png' },
      { id: 'sg-2', name: '반팔', pct: 28, img: 'assets/Img/short-sleeve.png' },
      { id: 'sg-3', name: '가디건', pct: 18, img: 'assets/Img/jacket.png' },
      { id: 'sg-4', name: '니트', pct: 12, img: 'assets/Img/coat.png' },
    ],
    outfitByTeam: {
      '팀 추워': {
        title: '오늘의 추천 코디',
        comment: '서교동은 낮에도 바람이 불 수 있으니 긴팔 위에 가디건이나 얇은 자켓을 챙겨보세요.',
        img: 'assets/Img/jacket.png',
      },
      '팀 딱좋아': {
        title: '오늘의 추천 코디',
        comment: '가벼운 셔츠나 얇은 긴팔로 산뜻하게 입기 좋은 날씨예요.',
        img: 'assets/Img/long-sleeve.png',
      },
      '팀 더워': {
        title: '오늘의 추천 코디',
        comment: '한낮에는 따뜻하니 반팔이나 가벼운 상의 위주로 시원하게 입어보세요.',
        img: 'assets/Img/short-sleeve.png',
      },
    },
  },
  {
    id: 'yeoksam',
    label: '역삼',
    sido: '서울특별시',
    sigungu: '강남구',
    dong: '역삼동',
    zone: '서울남권',
    fullRegion: '서울특별시 강남구 역삼동',
    updatedAt: '11. 24. 오후 06:00 기준',
    weatherPayload: {
      아침: {
        temp: 8,
        feelsLike: 6,
        condition: '구름조금',
        high: 15,
        low: 6,
        humidity: '52%',
        wind: '1.9 m/s',
        rainProb: '10%',
      },
      낮: {
        temp: 15,
        feelsLike: 14,
        condition: '맑음',
        high: 15,
        low: 6,
        humidity: '44%',
        wind: '1.6 m/s',
        rainProb: '10%',
      },
      저녁: {
        temp: 9,
        feelsLike: 7,
        condition: '맑음',
        high: 12,
        low: 5,
        humidity: '56%',
        wind: '2.0 m/s',
        rainProb: '10%',
      },
    },
    streetStyles: [
      { id: 'yk-1', name: '코트', pct: 36, img: 'assets/Img/coat.png' },
      { id: 'yk-2', name: '니트', pct: 29, img: 'assets/Img/long-sleeve.png' },
      { id: 'yk-3', name: '자켓', pct: 20, img: 'assets/Img/jacket.png' },
      { id: 'yk-4', name: '패딩', pct: 15, img: 'assets/Img/padding.png' },
    ],
    outfitByTeam: {
      '팀 추워': {
        title: '오늘의 추천 코디',
        comment: '일교차가 있으니 니트와 함께 보온성 있는 아우터를 꼭 걸치는 걸 추천해요.',
        img: 'assets/Img/coat.png',
      },
      '팀 딱좋아': {
        title: '오늘의 추천 코디',
        comment: '단정한 셔츠·니트 조합에 자켓이나 코트를 매치하면 깔끔하게 어울려요.',
        img: 'assets/Img/long-sleeve.png',
      },
      '팀 더워': {
        title: '오늘의 추천 코디',
        comment: '걸음이 많아지면 금방 따뜻해지니 레이어드하기 쉬운 상의를 골라보세요.',
        img: 'assets/Img/jacket.png',
      },
    },
  },
];

const INITIAL_REVIEWS = [
  { id: 1, author: '주주', team: '팀 추워', tag: '딱 좋아요', text: '아침 공기에는 아우터 걸치니까 딱 맞았어요.' },
  { id: 2, author: '민지', team: '팀 딱좋아', tag: '딱 좋아요', text: '거리 스타일 TOP4랑 실제 체감이 비슷해서 고르기 쉬웠어요.' },
];

const BASE_OUTFIT_ITEMS = [
  {
    id: 'item-coat',
    category: '아우터',
    name: '클래식 울 블렌드 코트',
    keywords: ['코트', '아우터', '단정', '출근'],
    comment: '바람을 막아주면서도 깔끔한 실루엣을 살려주는 데일리 코트예요.',
    img: 'assets/Img/coat.png',
  },
  {
    id: 'item-padding',
    category: '아우터',
    name: '라이트 퀼팅 패딩',
    keywords: ['패딩', '롱패딩', '숏패딩', '보온', '추위'],
    comment: '기온이 낮거나 바람이 불 때 체온을 안정적으로 지켜주는 아우터예요.',
    img: 'assets/Img/padding.png',
  },
  {
    id: 'item-jacket',
    category: '아우터',
    name: '소프트 텍스처 자켓',
    keywords: ['자켓', '가디건', '환절기', '레이어드'],
    comment: '실내외 기온 차가 있을 때 간편하게 입고 벗기 좋은 아우터예요.',
    img: 'assets/Img/jacket.png',
  },
  {
    id: 'item-long',
    category: '상의',
    name: '코튼 블렌드 롱슬리브',
    keywords: ['긴팔', '셔츠', '니트', '상의', '기본'],
    comment: '단독으로 입거나 아우터 안에 받쳐 입기 좋은 기본 상의예요.',
    img: 'assets/Img/long-sleeve.png',
  },
  {
    id: 'item-short',
    category: '상의',
    name: '헤비 코튼 반팔 티셔츠',
    keywords: ['반팔', '티셔츠', '여름', '활동'],
    comment: '기온이 높거나 실내 활동이 많을 때 쾌적하게 입기 좋은 상의예요.',
    img: 'assets/Img/short-sleeve.png',
  },
];

export default function App() {
  const [screen, setScreen] = useState('home'); // onboarding | home | outfit | my
  const [onboardingStep, setOnboardingStep] = useState(1); // 1: 닉네임, 2: 위치, 3: 체질
  const [regionId, setRegionId] = useState('seongsu');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [timeSlot, setTimeSlot] = useState('아침');

  const [nickname, setNickname] = useState(
    () => localStorage.getItem('wearther_nickname') || '주주'
  );
  const [team, setTeam] = useState(
    () => localStorage.getItem('wearther_team') || '팀 추워'
  );
  const [closetInput, setClosetInput] = useState(
    () => localStorage.getItem('wearther_closet') || '니트, 코트'
  );
  const [feedback, setFeedback] = useState('딱 지금 정도로');
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('wearther_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });
  const [reviewInput, setReviewInput] = useState('');
  const [reviewTag, setReviewTag] = useState('딱 좋아요');
  const [rpcData, setRpcData] = useState([]);

  useEffect(() => {
    localStorage.setItem('wearther_nickname', nickname);
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem('wearther_team', team);
  }, [team]);

  useEffect(() => {
    localStorage.setItem('wearther_closet', closetInput);
  }, [closetInput]);

  useEffect(() => {
    try {
      localStorage.setItem('wearther_reviews', JSON.stringify(reviews));
    } catch {
      // ignore storage quota errors
    }
  }, [reviews]);

  const currentRegion = useMemo(
    () => REGION_OPTIONS.find((r) => r.id === regionId) || REGION_OPTIONS[0],
    [regionId]
  );

  const filteredRegions = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return REGION_OPTIONS;
    return REGION_OPTIONS.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.sido.toLowerCase().includes(q) ||
        r.sigungu.toLowerCase().includes(q) ||
        r.dong.toLowerCase().includes(q) ||
        r.fullRegion.toLowerCase().includes(q)
    );
  }, [locationQuery]);

  const slotWeather = useMemo(() => {
    return currentRegion.weatherPayload[timeSlot] || currentRegion.weatherPayload.아침;
  }, [currentRegion, timeSlot]);

  const activeOutfit = useMemo(() => {
    return currentRegion.outfitByTeam[team] || currentRegion.outfitByTeam['팀 추워'];
  }, [currentRegion, team]);

  useEffect(() => {
    let active = true;
    supabase
      .rpc('get_recommendations_by_weather', {
        p_region: currentRegion.fullRegion,
        p_weather: currentRegion.weatherPayload,
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
  }, [currentRegion]);

  const recommendedItems = useMemo(() => {
    const closetTokens = closetInput
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const feedbackShift =
      feedback === '더 시원하게' ? 1 : feedback === '더 따뜻하게' ? -1 : 0;
    const effectiveTemp = slotWeather.temp + feedbackShift;

    const baseList =
      rpcData.length > 0
        ? rpcData.map((row, idx) => ({
            id: row.id || `rpc-${idx}`,
            category: row.category || '추천',
            name: row.name || row.title || '추천 의류',
            keywords: Array.isArray(row.keywords) ? row.keywords : [],
            comment: row.comment || row.description || activeOutfit.comment,
            img: row.img || row.image || 'assets/Img/coat.png',
          }))
        : BASE_OUTFIT_ITEMS;

    return [...baseList]
      .map((item) => {
        const matchesCloset = closetTokens.some(
          (tok) =>
            item.name.toLowerCase().includes(tok) ||
            item.category.toLowerCase().includes(tok) ||
            item.keywords.some((k) => String(k).toLowerCase().includes(tok))
        );

        let tempScore = 0;
        if (effectiveTemp <= 9) {
          tempScore = item.name.includes('패딩') || item.name.includes('코트') ? 3 : 1;
        } else if (effectiveTemp <= 19) {
          tempScore = item.name.includes('자켓') || item.name.includes('롱슬리브') || item.name.includes('코트') ? 3 : 1;
        } else {
          tempScore = item.name.includes('반팔') || item.name.includes('롱슬리브') ? 3 : 1;
        }

        return {
          ...item,
          fromCloset: matchesCloset,
          score: (matchesCloset ? 10 : 0) + tempScore,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [rpcData, closetInput, feedback, slotWeather.temp, activeOutfit.comment]);

  const handleAddReview = (e) => {
    e.preventDefault();
    const trimmed = reviewInput.trim();
    if (!trimmed) return;
    setReviews((prev) => [
      {
        id: Date.now(),
        author: nickname || '주주',
        team,
        tag: reviewTag,
        text: trimmed,
      },
      ...prev,
    ]);
    setReviewInput('');
  };

  return (
    <div className="wearther-shell">
      <div className="wearther-phone">
        {screen === 'onboarding' && (
          <div className="screen-scroll onboarding-screen">
            <div className="onboarding-header">
              <span className="brand-title">옷늘날씨</span>
              <span className="step-pill">{onboardingStep} / 3</span>
            </div>

            {onboardingStep === 1 && (
              <div className="onboarding-card">
                <h2>사용할 닉네임을 입력해주세요</h2>
                <p className="muted-desc">별도 로그인 없이 브라우저에 닉네임이 저장됩니다.</p>
                <input
                  type="text"
                  className="text-field"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임 입력"
                />
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setOnboardingStep(2)}
                >
                  다음
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="onboarding-card">
                <h2>어느 지역의 날씨를 볼까요?</h2>
                <p className="muted-desc">시·구·동으로 위치를 선택할 수 있습니다.</p>
                <div className="choice-stack">
                  {REGION_OPTIONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`choice-card ${regionId === r.id ? 'selected' : ''}`}
                      onClick={() => setRegionId(r.id)}
                    >
                      <strong>{r.label}</strong>
                      <span>{r.fullRegion}</span>
                    </button>
                  ))}
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setOnboardingStep(1)}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setOnboardingStep(3)}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="onboarding-card">
                <h2>평소 체질 그룹을 선택해주세요</h2>
                <p className="muted-desc">선택한 체질에 맞춰 오늘의 추천 코디를 보여줍니다.</p>
                <div className="choice-stack">
                  {['팀 추워', '팀 딱좋아', '팀 더워'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`choice-card ${team === t ? 'selected' : ''}`}
                      onClick={() => setTeam(t)}
                    >
                      <strong>{t}</strong>
                    </button>
                  ))}
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setOnboardingStep(2)}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setScreen('home')}
                  >
                    시작하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === 'home' && (
          <div className="screen-scroll">
            <header className="top-header">
              <button
                type="button"
                className="brand-title-btn"
                onClick={() => {
                  setOnboardingStep(1);
                  setScreen('onboarding');
                }}
              >
                옷늘날씨
              </button>
              <select
                aria-label="시간대 선택"
                className="slot-dropdown"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="아침">아침</option>
                <option value="낮">낮</option>
                <option value="저녁">저녁</option>
              </select>
            </header>

            <section className="weather-panel">
              <div className="weather-top-row">
                <div>
                  <button
                    type="button"
                    className="region-chip"
                    onClick={() => setLocationModalOpen(true)}
                  >
                    ● {currentRegion.label} ▾
                  </button>
                  <div className="temp-display">{slotWeather.temp}°C</div>
                  <div className="weather-summary">
                    {slotWeather.condition} · 체감 {slotWeather.feelsLike}°C
                  </div>
                </div>
                <div className="weather-badge-group">
                  <span className="team-pill">{team}</span>
                </div>
              </div>

              <div className="weather-grid">
                <div className="metric-cell">
                  <strong>{slotWeather.high}° / {slotWeather.low}°</strong>
                  <span>최고 / 최저</span>
                </div>
                <div className="metric-cell">
                  <strong>{slotWeather.humidity}</strong>
                  <span>습도</span>
                </div>
                <div className="metric-cell">
                  <strong>{slotWeather.wind}</strong>
                  <span>풍속</span>
                </div>
                <div className="metric-cell">
                  <strong>{slotWeather.rainProb}</strong>
                  <span>강수확률</span>
                </div>
              </div>
            </section>

            <section className="section-block">
              <div className="section-head">
                <h2>지금 이 거리의 스타일</h2>
                <span className="meta-caption">갱신 · {currentRegion.updatedAt}</span>
              </div>

              <div className="street-scroll-row">
                {currentRegion.streetStyles.map((item) => (
                  <div key={item.id} className="street-card">
                    <div className="street-img-box">
                      <img
                        src={assetUrl(item.img)}
                        alt={item.name}
                        className="street-img"
                      />
                    </div>
                    <div className="street-card-footer">
                      <span className="street-name">{item.name}</span>
                      <strong className="street-pct">{item.pct}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="section-block">
              <div className="section-head">
                <h2>오늘은 이렇게 입어보세요</h2>
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={() => setScreen('outfit')}
                >
                  자세히 보기
                </button>
              </div>

              <div className="feedback-bar">
                {['더 시원하게', '딱 지금 정도로', '더 따뜻하게'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`feedback-chip ${feedback === opt ? 'active' : ''}`}
                    onClick={() => setFeedback(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div
                className="hero-outfit-card"
                role="button"
                tabIndex={0}
                onClick={() => setScreen('outfit')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setScreen('outfit');
                }}
              >
                <img
                  src={assetUrl(activeOutfit.img)}
                  alt={activeOutfit.title}
                  className="hero-outfit-img"
                />
                <div className="hero-outfit-body">
                  <div className="hero-outfit-title">{activeOutfit.title}</div>
                  <p className="hero-outfit-comment">{activeOutfit.comment}</p>
                </div>
              </div>

              <div className="recommend-list">
                {recommendedItems.map((item) => (
                  <div key={item.id} className="recommend-card">
                    <img
                      src={assetUrl(item.img)}
                      alt={item.name}
                      className="recommend-thumb"
                    />
                    <div className="recommend-info">
                      <div className="recommend-title-row">
                        <strong>{item.name}</strong>
                        {item.fromCloset && (
                          <span className="closet-tag">내 옷장</span>
                        )}
                      </div>
                      <p className="recommend-desc">{item.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {screen === 'outfit' && (
          <div className="screen-scroll">
            <header className="top-header">
              <span className="brand-title">오늘의 코디</span>
              <span className="region-inline">{currentRegion.label} · {team}</span>
            </header>

            <div className="detail-photo-wrap">
              <img
                src={assetUrl(activeOutfit.img)}
                alt={activeOutfit.title}
                className="detail-photo"
              />
            </div>

            <section className="section-block">
              <h2>{activeOutfit.title}</h2>
              <p className="detail-comment">{activeOutfit.comment}</p>

              <form onSubmit={handleAddReview} className="review-composer">
                <div className="tag-selector">
                  {['추워요', '딱 좋아요', '더워요'].map((tg) => (
                    <button
                      key={tg}
                      type="button"
                      className={`tag-pill ${reviewTag === tg ? 'active' : ''}`}
                      onClick={() => setReviewTag(tg)}
                    >
                      {tg}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="text-field"
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="오늘 코디 체감 리뷰를 남겨보세요"
                />
                <button type="submit" className="primary-btn">
                  리뷰 등록
                </button>
              </form>

              <div className="review-feed">
                {reviews.map((rv) => (
                  <div key={rv.id} className="review-card">
                    <div className="review-header">
                      <strong>{rv.author}</strong>
                      <span>{rv.team} · {rv.tag}</span>
                    </div>
                    <p className="review-body">{rv.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {screen === 'my' && (
          <div className="screen-scroll">
            <header className="top-header">
              <span className="brand-title">MY</span>
              <button
                type="button"
                className="text-link-btn"
                onClick={() => {
                  setOnboardingStep(1);
                  setScreen('onboarding');
                }}
              >
                초기 설정 다시보기
              </button>
            </header>

            <section className="profile-card">
              <div className="profile-name">{nickname}</div>
              <div className="profile-sub">{team} · {currentRegion.fullRegion}</div>
            </section>

            <section className="section-block form-stack">
              <label className="field-label">닉네임</label>
              <input
                type="text"
                className="text-field"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />

              <label className="field-label">체질 그룹</label>
              <select
                className="text-field"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              >
                <option value="팀 추워">팀 추워</option>
                <option value="팀 딱좋아">팀 딱좋아</option>
                <option value="팀 더워">팀 더워</option>
              </select>

              <label className="field-label">내 옷장 키워드 (쉼표로 구분)</label>
              <input
                type="text"
                className="text-field"
                value={closetInput}
                onChange={(e) => setClosetInput(e.target.value)}
                placeholder="예: 니트, 코트, 반팔"
              />
            </section>
          </div>
        )}

        {locationModalOpen && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-sheet">
              <div className="modal-head">
                <strong>위치 선택</strong>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setLocationModalOpen(false)}
                >
                  닫기
                </button>
              </div>
              <input
                type="text"
                className="text-field"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="읍, 면, 동으로 검색"
              />
              <div className="location-list">
                {filteredRegions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`location-row ${regionId === r.id ? 'active' : ''}`}
                    onClick={() => {
                      setRegionId(r.id);
                      setLocationModalOpen(false);
                      setLocationQuery('');
                    }}
                  >
                    <strong>{r.label}</strong>
                    <span>{r.fullRegion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <nav className="bottom-tabbar" aria-label="하단 탭">
          <button
            type="button"
            className={`tab-btn ${screen === 'home' ? 'active' : ''}`}
            onClick={() => setScreen('home')}
          >
            홈
          </button>
          <button
            type="button"
            className={`tab-btn ${screen === 'outfit' ? 'active' : ''}`}
            onClick={() => setScreen('outfit')}
          >
            오늘의 코디
          </button>
          <button
            type="button"
            className={`tab-btn ${screen === 'my' ? 'active' : ''}`}
            onClick={() => setScreen('my')}
          >
            마이
          </button>
        </nav>
      </div>
    </div>
  );
}