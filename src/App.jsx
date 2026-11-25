import React, { useEffect, useMemo, useState } from 'react';

const BASE = import.meta.env.BASE_URL || '/';

const assetUrl = (relativePath) => {
  const clean = String(relativePath || '').replace(/^\/+/, '');
  return `${BASE}${clean}`;
};

const REGION_CATALOG = [
  {
    id: 'seongsu',
    label: '성수동2가',
    sido: '서울특별시',
    sigungu: '성동구',
    dong: '성수동2가',
    zone: '서울동권',
    fullAddress: '서울특별시 성동구 성수동2가',
    temp: 24,
    feelsLike: 26,
    condition: '맑음',
    high: 26,
    low: 14,
    humidity: '40%',
    wind: '1.5 m/s',
    rainProb: '0%',
  },
  {
    id: 'seogyo',
    label: '서교동',
    sido: '서울특별시',
    sigungu: '마포구',
    dong: '서교동',
    zone: '서울서권',
    fullAddress: '서울특별시 마포구 서교동',
    temp: 23,
    feelsLike: 24,
    condition: '맑음',
    high: 25,
    low: 13,
    humidity: '45%',
    wind: '1.7 m/s',
    rainProb: '10%',
  },
  {
    id: 'yeoksam',
    label: '역삼동',
    sido: '서울특별시',
    sigungu: '강남구',
    dong: '역삼동',
    zone: '서울남권',
    fullAddress: '서울특별시 강남구 역삼동',
    temp: 24,
    feelsLike: 25,
    condition: '맑음',
    high: 26,
    low: 14,
    humidity: '42%',
    wind: '1.6 m/s',
    rainProb: '0%',
  },
  {
    id: 'sangsu',
    label: '상수동',
    sido: '서울특별시',
    sigungu: '마포구',
    dong: '상수동',
    zone: '서울서권',
    fullAddress: '서울특별시 마포구 상수동',
    temp: 22,
    feelsLike: 23,
    condition: '맑음',
    high: 24,
    low: 12,
    humidity: '48%',
    wind: '1.4 m/s',
    rainProb: '10%',
  },
];

const STREET_TRENDS = [
  { id: 'tr-1', name: '가디건 레이어드', img: 'assets/Img/jacket.png' },
  { id: 'tr-2', name: '코튼 셔츠룩', img: 'assets/Img/long-sleeve.png' },
  { id: 'tr-3', name: '라이트 아우터', img: 'assets/Img/coat.png' },
];

const HOURLY_FORECAST = [
  { time: '지금', temp: 27, rain: '0%', icon: 'sun' },
  { time: '15시', temp: 26, rain: '0%', icon: 'sun' },
  { time: '18시', temp: 25, rain: '10%', icon: 'sun' },
  { time: '21시', temp: 24, rain: '10%', icon: 'cloud' },
  { time: '00시', temp: 23, rain: '0%', icon: 'cloud' },
  { time: '03시', temp: 22, rain: '0%', icon: 'cloud' },
];

const WEEKLY_FORECAST = [
  { day: '오늘 (수)', cond: '맑음', high: 26, low: 14, rain: '0%' },
  { day: '내일 (목)', cond: '맑음', high: 25, low: 13, rain: '10%' },
  { day: '금요일', cond: '구름조금', high: 23, low: 12, rain: '20%' },
  { day: '토요일', cond: '맑음', high: 24, low: 13, rain: '0%' },
  { day: '일요일', cond: '맑음', high: 25, low: 14, rain: '0%' },
  { day: '월요일', cond: '흐림', high: 21, low: 11, rain: '30%' },
  { day: '화요일', cond: '맑음', high: 22, low: 11, rain: '10%' },
];

const OUTFIT_DETAIL = {
  title: '얇은 가디건을 더한 미니멀 룩',
  description:
    '낮 기온은 따뜻하지만 아침·저녁 일교차와 실내 냉방 온도 차가 있어 가볍게 걸칠 수 있는 얇은 가디건을 매치한 미니멀 코디입니다.',
  img: 'assets/Img/jacket.png',
};

const INITIAL_REVIEWS = [
  {
    id: 1,
    outfitTitle: '얇은 가디건을 더한 미니멀 룩',
    author: '하늘구름',
    date: '2026.11.24',
    fitLabel: '적당했어요',
    text: '낮에는 가디건 벗고 다니고 저녁에 걸치니까 딱 알맞았어요.',
  },
  {
    id: 2,
    outfitTitle: '데일리 시즈 레이어드 룩',
    author: '봄바람',
    date: '2026.11.23',
    fitLabel: '더웠어요',
    text: '한낮 햇볕 아래에서는 얇은 이너 하나만 입어도 충분했어요.',
  },
  {
    id: 3,
    outfitTitle: '얇은 가디건을 더한 미니멀 룩',
    author: '노을빛',
    date: '2026.11.22',
    fitLabel: '추웠어요',
    text: '바람이 부는 저녁 시간에는 한 겹 더 챙기는 게 좋겠어요.',
  },
];

export default function App() {
  // screens:
  // 'login' | 'location-perm' | 'onboarding-gender' | 'onboarding-temp' | 'onboarding-nickname'
  // | 'loading' | 'home' | 'weather-detail' | 'outfit-detail' | 'review-write' | 'my' | 'my-reviews'
  const [screen, setScreen] = useState('login');
  const [googleSheetOpen, setGoogleSheetOpen] = useState(false);
  const [googleStep, setGoogleStep] = useState('prompt'); // 'prompt' | 'account' | 'consent'
  const [welcomeSheetOpen, setWelcomeSheetOpen] = useState(false);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [reviewDoneModalOpen, setReviewDoneModalOpen] = useState(false);

  const [genderPref, setGenderPref] = useState(''); // '남성' | '여성'
  const [tempPref, setTempPref] = useState('조금만 추워도 춥게 느껴요');
  const [nickname, setNickname] = useState(
    () => localStorage.getItem('wearther_nickname') || '졸업프로젝트'
  );
  const [regionId, setRegionId] = useState(
    () => localStorage.getItem('wearther_region_id') || 'seongsu'
  );

  const [locationQuery, setLocationQuery] = useState('');
  const [candidateRegionId, setCandidateRegionId] = useState('');

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('wearther_reviews_v2');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });
  const [fitChoice, setFitChoice] = useState(''); // '추웠어요' | '적당했어요' | '더웠어요'
  const [reviewText, setReviewText] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  useEffect(() => {
    localStorage.setItem('wearther_nickname', nickname);
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem('wearther_region_id', regionId);
  }, [regionId]);

  useEffect(() => {
    try {
      localStorage.setItem('wearther_reviews_v2', JSON.stringify(reviews));
    } catch {
      // ignore storage quota errors
    }
  }, [reviews]);

  useEffect(() => {
    if (screen !== 'loading') return;
    const timer = setTimeout(() => {
      setScreen('home');
      setWelcomeSheetOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [screen]);

  const currentRegion = useMemo(
    () => REGION_CATALOG.find((r) => r.id === regionId) || REGION_CATALOG[0],
    [regionId]
  );

  const searchResults = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return [];
    return REGION_CATALOG.filter(
      (r) =>
        r.dong.toLowerCase().includes(q) ||
        r.sigungu.toLowerCase().includes(q) ||
        r.sido.toLowerCase().includes(q) ||
        r.fullAddress.toLowerCase().includes(q)
    );
  }, [locationQuery]);

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2;
  const isReviewSubmitEnabled = fitChoice.length > 0;

  const activeTab = useMemo(() => {
    if (screen === 'outfit-detail' || screen === 'review-write') return 'outfit';
    if (screen === 'my' || screen === 'my-reviews') return 'my';
    return 'home';
  }, [screen]);

  const showBottomBar =
    screen === 'home' ||
    screen === 'weather-detail' ||
    screen === 'outfit-detail' ||
    screen === 'my' ||
    screen === 'my-reviews';

  const handleOpenLocationSheet = () => {
    setLocationQuery('');
    setCandidateRegionId('');
    setLocationSheetOpen(true);
  };

  const handleUseCurrentLocation = () => {
    setRegionId('seongsu');
    setLocationSheetOpen(false);
  };

  const handleConfirmLocationChange = () => {
    if (!candidateRegionId) return;
    setRegionId(candidateRegionId);
    setLocationSheetOpen(false);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isReviewSubmitEnabled) return;
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(today.getDate()).padStart(2, '0')}`;

    const newItem = {
      id: Date.now(),
      outfitTitle: OUTFIT_DETAIL.title,
      author: trimmedNickname || '졸업프로젝트',
      date: formattedDate,
      fitLabel: fitChoice,
      text: reviewText.trim(),
    };

    setReviews((prev) => [newItem, ...prev]);
    setFitChoice('');
    setReviewText('');
    setReviewDoneModalOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app-viewport">
      <div className="phone-frame">
        <div className="status-bar">
          <span>16:01</span>
          <span>5G · 100%</span>
        </div>

        {/* 1. 로그인 화면 */}
        {screen === 'login' && (
          <div className="screen-body login-body">
            <div className="login-center">
              <div className="logo-mark-box" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
                  <path
                    d="M15 11L20 8C21.5 10 26.5 10 28 8L33 11L40 16L36 24L31 21V39H17V21L12 24L8 16L15 11Z"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="app-title">옷늘날씨</h1>
              <p className="app-subtitle">Today&apos;s WEARther</p>
            </div>

            <div className="login-footer">
              <button
                type="button"
                className="google-login-btn"
                onClick={() => {
                  setGoogleStep('prompt');
                  setGoogleSheetOpen(true);
                }}
              >
                <span className="g-badge" aria-hidden="true">
                  G
                </span>
                <span>구글로 로그인/회원가입</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. 위치 권한 화면 */}
        {screen === 'location-perm' && (
          <div className="screen-body step-body">
            <div className="step-header-row">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('login')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="mini-tag">위치 설정</span>
              <span className="spacer-24" />
            </div>

            <div className="perm-center">
              <div className="pin-circle" aria-hidden="true">
                📍
              </div>
              <span className="eyebrow-sky">위치 정보 안내</span>
              <h2 className="step-title center-text">지금 있는 곳의 날씨를 확인할게요</h2>
              <p className="step-desc center-text">
                위치 정보는 현재 날씨와 주변 거리 스타일을 안내하는 데에만 사용됩니다.
              </p>
            </div>

            <div className="bottom-btn-stack">
              <button
                type="button"
                className="sky-primary-btn"
                onClick={() => {
                  setRegionId('seongsu');
                  setScreen('onboarding-gender');
                }}
              >
                위치 사용을 허용하고 계속하기
              </button>
              <button
                type="button"
                className="white-outline-btn"
                onClick={() => {
                  handleOpenLocationSheet();
                  setScreen('onboarding-gender');
                }}
              >
                지역 직접 선택
              </button>
            </div>
          </div>
        )}

        {/* 3. 온보딩 1/3 성별 코디 선택 */}
        {screen === 'onboarding-gender' && (
          <div className="screen-body step-body">
            <div className="step-header-row">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('location-perm')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="step-counter">1/3</span>
              <span className="spacer-24" />
            </div>

            <div className="step-content">
              <h2 className="step-title">옷늘날씨에서 어떤 성별의 코디를 찾고 있나요?</h2>
              <p className="step-desc">추천 코디 스타일을 골라주세요.</p>

              <div className="gender-grid">
                {['남성', '여성'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`gender-toggle-btn ${genderPref === g ? 'selected' : ''}`}
                    onClick={() => setGenderPref(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="bottom-btn-stack">
              <button
                type="button"
                className={`sky-primary-btn ${!genderPref ? 'disabled' : ''}`}
                disabled={!genderPref}
                onClick={() => setScreen('onboarding-temp')}
              >
                다음 단계
              </button>
            </div>
          </div>
        )}

        {/* 4. 온보딩 2/3 체감 온도 */}
        {screen === 'onboarding-temp' && (
          <div className="screen-body step-body">
            <div className="step-header-row">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('onboarding-gender')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="step-counter">2/3</span>
              <span className="spacer-24" />
            </div>

            <div className="step-content">
              <h2 className="step-title">평소 추위나 더위를 얼마나 타는 편이신가요?</h2>
              <p className="step-desc">개인 체감 온도를 반영해 옷차림을 맞춰드려요.</p>

              <div className="radio-list">
                {[
                  '조금만 추워도 춥게 느껴요',
                  '보통이에요',
                  '조금만 더워도 덥게 느껴요',
                ].map((opt) => {
                  const active = tempPref === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`radio-row-btn ${active ? 'selected' : ''}`}
                      onClick={() => setTempPref(opt)}
                    >
                      <span className={`radio-dot ${active ? 'active' : ''}`} />
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bottom-btn-stack">
              <button
                type="button"
                className="sky-primary-btn"
                onClick={() => setScreen('onboarding-nickname')}
              >
                다음 단계
              </button>
            </div>
          </div>
        )}

        {/* 5. 온보딩 3/3 닉네임 */}
        {screen === 'onboarding-nickname' && (
          <div className="screen-body step-body">
            <div className="step-header-row">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('onboarding-temp')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="step-counter">3/3</span>
              <span className="spacer-24" />
            </div>

            <div className="step-content">
              <h2 className="step-title">옷늘날씨에서 사용할 닉네임을 입력해주세요</h2>
              <p className="step-desc">최소 2자 이상 입력해주세요.</p>

              <div className="underline-field-wrap">
                <input
                  type="text"
                  className="underline-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={16}
                />
                <div className="underline-meta">
                  <span>
                    {trimmedNickname.length === 0
                      ? '닉네임을 입력해주세요'
                      : trimmedNickname.length < 2
                      ? '2자 이상 입력해주세요'
                      : '사용 가능한 닉네임입니다'}
                  </span>
                  <span>{trimmedNickname.length}/16</span>
                </div>
              </div>
            </div>

            <div className="bottom-btn-stack">
              <button
                type="button"
                className={`sky-primary-btn ${!isNicknameValid ? 'disabled' : ''}`}
                disabled={!isNicknameValid}
                onClick={() => setScreen('loading')}
              >
                회원가입하기
              </button>
            </div>
          </div>
        )}

        {/* 6. 로딩 화면 */}
        {screen === 'loading' && (
          <div className="screen-body loading-body">
            <div className="sky-spinner" aria-hidden="true" />
            <p className="loading-text">
              {trimmedNickname || '졸업프로젝트'} 님이 오늘 입을 옷을 찾고있어요
            </p>
          </div>
        )}

        {/* 7. 홈 화면 */}
        {screen === 'home' && (
          <div className="screen-body scroll-body">
            <header className="brand-header">
              <span className="header-brand-sky">옷늘날씨</span>
            </header>

            <section
              className="weather-hero-card"
              role="button"
              tabIndex={0}
              onClick={() => setScreen('weather-detail')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setScreen('weather-detail');
              }}
            >
              <div className="weather-hero-top">
                <div>
                  <button
                    type="button"
                    className="loc-pill-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLocationSheet();
                    }}
                  >
                    <span>📍</span>
                    <span>{currentRegion.label}</span>
                  </button>
                  <div className="hero-temp">{currentRegion.temp}°C</div>
                  <div className="hero-sub">
                    {currentRegion.condition} · 체감 {currentRegion.feelsLike}°C
                  </div>
                </div>
                <div className="yellow-sun" aria-hidden="true" />
              </div>

              <div className="weather-four-cols">
                <div className="w-col">
                  <strong>
                    {currentRegion.high}° / {currentRegion.low}°
                  </strong>
                  <span>최고/최저</span>
                </div>
                <div className="w-col">
                  <strong>{currentRegion.humidity}</strong>
                  <span>습도</span>
                </div>
                <div className="w-col">
                  <strong>{currentRegion.wind}</strong>
                  <span>풍속</span>
                </div>
                <div className="w-col">
                  <strong>{currentRegion.rainProb}</strong>
                  <span>강수확률</span>
                </div>
              </div>
            </section>

            <section className="home-section">
              <div className="home-section-head">
                <h2>지금 거리의 스타일</h2>
              </div>
              <div className="street-three-row">
                {STREET_TRENDS.map((st) => (
                  <div key={st.id} className="street-tile">
                    <img
                      src={assetUrl(st.img)}
                      alt={st.name}
                      className="street-tile-img"
                    />
                    <div className="street-tile-label">{st.name}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <div className="home-section-head">
                <h2>오늘은 이렇게 입어보세요</h2>
                <button
                  type="button"
                  className="detail-link-btn"
                  onClick={() => setScreen('outfit-detail')}
                >
                  자세히 보기
                </button>
              </div>

              <div
                className="main-outfit-banner"
                role="button"
                tabIndex={0}
                onClick={() => setScreen('outfit-detail')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setScreen('outfit-detail');
                }}
              >
                <img
                  src={assetUrl(OUTFIT_DETAIL.img)}
                  alt={OUTFIT_DETAIL.title}
                  className="main-outfit-img"
                />
                <div className="main-outfit-caption">
                  <strong>{OUTFIT_DETAIL.title}</strong>
                  <span>{tempPref}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 8. 날씨 상세 화면 */}
        {screen === 'weather-detail' && (
          <div className="screen-body scroll-body">
            <div className="detail-top-bar">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('home')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="center-page-title">날씨</span>
              <span className="spacer-24" />
            </div>

            <section className="weather-hero-card compact">
              <div className="weather-hero-top">
                <div>
                  <button
                    type="button"
                    className="loc-pill-btn"
                    onClick={handleOpenLocationSheet}
                  >
                    <span>📍</span>
                    <span>{currentRegion.label}</span>
                  </button>
                  <div className="hero-temp">{currentRegion.temp}°C</div>
                  <div className="hero-sub">
                    {currentRegion.condition} · 체감 {currentRegion.feelsLike}°C
                  </div>
                </div>
                <div className="yellow-sun" aria-hidden="true" />
              </div>

              <div className="weather-four-cols">
                <div className="w-col">
                  <strong>
                    {currentRegion.high}° / {currentRegion.low}°
                  </strong>
                  <span>최고/최저</span>
                </div>
                <div className="w-col">
                  <strong>{currentRegion.humidity}</strong>
                  <span>습도</span>
                </div>
                <div className="w-col">
                  <strong>{currentRegion.wind}</strong>
                  <span>풍속</span>
                </div>
                <div className="w-col">
                  <strong>{currentRegion.rainProb}</strong>
                  <span>강수확률</span>
                </div>
              </div>
            </section>

            <section className="home-section">
              <h2 className="sub-section-title">시간대별 예보</h2>
              <div className="hourly-strip">
                {HOURLY_FORECAST.map((hr) => (
                  <div key={hr.time} className="hourly-cell">
                    <span className="hr-time">{hr.time}</span>
                    <span className="hr-icon">{hr.icon === 'sun' ? '☀️' : '⛅'}</span>
                    <strong className="hr-temp">{hr.temp}°</strong>
                    <span className="hr-rain">{hr.rain}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <h2 className="sub-section-title">7일 예보</h2>
              <div className="weekly-card-list">
                {WEEKLY_FORECAST.map((wk) => (
                  <div key={wk.day} className="weekly-row">
                    <span className="wk-day">{wk.day}</span>
                    <span className="wk-cond">{wk.cond}</span>
                    <span className="wk-rain">{wk.rain}</span>
                    <strong className="wk-temps">
                      {wk.high}° / {wk.low}°
                    </strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 9. 오늘의 추천 상세 화면 */}
        {screen === 'outfit-detail' && (
          <div className="screen-body scroll-body">
            <header className="brand-header">
              <span className="header-brand-sky">옷늘날씨</span>
            </header>

            <div className="full-width-photo-box">
              <img
                src={assetUrl(OUTFIT_DETAIL.img)}
                alt={OUTFIT_DETAIL.title}
                className="full-width-photo"
              />
            </div>

            <div className="detail-body-pad">
              <h1 className="outfit-detail-title">{OUTFIT_DETAIL.title}</h1>
              <p className="outfit-detail-desc">{OUTFIT_DETAIL.description}</p>

              <div className="review-section-box">
                <div className="review-section-head">
                  <h3>착용 리뷰 ({reviews.length})</h3>
                  <button
                    type="button"
                    className="sky-small-btn"
                    onClick={() => setScreen('review-write')}
                  >
                    리뷰 작성하기
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <div className="empty-state-box">
                    <p>아직 작성된 후기가 없어요</p>
                    <button
                      type="button"
                      className="sky-primary-btn"
                      onClick={() => setScreen('review-write')}
                    >
                      리뷰 작성하기
                    </button>
                  </div>
                ) : (
                  <div className="review-items">
                    {reviews.map((item) => (
                      <div key={item.id} className="review-row-card">
                        <div className="avatar-dot" aria-hidden="true" />
                        <div className="review-row-body">
                          <div className="review-meta">
                            <strong>{item.author}</strong> · <span>{item.date}</span> ·{' '}
                            <span className="fit-pill">{item.fitLabel}</span>
                          </div>
                          {item.text && <p className="review-comment">{item.text}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 10. 리뷰 작성 화면 */}
        {screen === 'review-write' && (
          <div className="screen-body step-body">
            <div className="detail-top-bar">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('outfit-detail')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="center-page-title">리뷰 작성하기</span>
              <span className="spacer-24" />
            </div>

            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label className="required-question">
                  위 옷을 입었더니 어땠나요? <span className="req-star">*</span>
                </label>
                <div className="three-fit-row">
                  {['추웠어요', '적당했어요', '더웠어요'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`fit-choice-btn ${fitChoice === opt ? 'selected' : ''}`}
                      onClick={() => setFitChoice(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="sub-question" htmlFor="review-textarea">
                  착용 소감을 남겨주세요
                </label>
                <textarea
                  id="review-textarea"
                  className="review-textarea"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="기온이나 바람에 따른 착용감을 자유롭게 적어주세요."
                  maxLength={200}
                  rows={5}
                />
                <div className="char-counter">{reviewText.length} / 200자</div>
              </div>

              <div className="bottom-btn-stack">
                <button
                  type="submit"
                  className={`sky-primary-btn ${!isReviewSubmitEnabled ? 'disabled' : ''}`}
                  disabled={!isReviewSubmitEnabled}
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 11. 마이페이지 (MY) */}
        {screen === 'my' && (
          <div className="screen-body scroll-body">
            <div className="my-top-title">MY</div>

            <div className="my-profile-center">
              <label className="profile-photo-picker" title="프로필 사진 변경">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="프로필" className="profile-photo-img" />
                ) : (
                  <div className="profile-photo-placeholder" aria-hidden="true" />
                )}
                <span className="camera-badge" aria-hidden="true">
                  📷
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-file-input"
                  onChange={handlePhotoChange}
                />
              </label>

              <div className="my-name-heading">{trimmedNickname || '졸업프로젝트'}</div>
              <div className="my-pref-sub">
                {genderPref ? `${genderPref} 코디` : '코디 성향 미선택'} · {tempPref}
              </div>
            </div>

            <div className="my-list-card">
              <button
                type="button"
                className="my-link-row"
                onClick={() => setScreen('my-reviews')}
              >
                <span>내 리뷰 {reviews.length}건 / 전체보기</span>
                <span>&gt;</span>
              </button>
              <button
                type="button"
                className="my-link-row"
                onClick={() => setScreen('onboarding-temp')}
              >
                <span>체감 온도 설정 변경</span>
                <span>&gt;</span>
              </button>
            </div>

            <div className="my-account-actions">
              <button
                type="button"
                className="logout-gray-btn"
                onClick={() => setScreen('login')}
              >
                로그아웃
              </button>
              <button
                type="button"
                className="withdraw-red-btn"
                onClick={() => {
                  setGenderPref('');
                  setScreen('login');
                }}
              >
                탈퇴
              </button>
            </div>
          </div>
        )}

        {/* 12. 작성한 리뷰 목록 */}
        {screen === 'my-reviews' && (
          <div className="screen-body scroll-body">
            <div className="detail-top-bar">
              <button
                type="button"
                className="icon-back-btn"
                onClick={() => setScreen('my')}
                aria-label="뒤로가기"
              >
                ←
              </button>
              <span className="center-page-title">작성한 리뷰</span>
              <span className="spacer-24" />
            </div>

            <div className="my-review-count-bar">작성한 리뷰 {reviews.length}건</div>

            {reviews.length === 0 ? (
              <div className="empty-state-box tall">
                <p>작성한 리뷰가 없어요</p>
              </div>
            ) : (
              <div className="gray-review-stack">
                {reviews.map((rv) => (
                  <div key={rv.id} className="gray-review-card">
                    <div className="gray-card-top">
                      <strong>{rv.outfitTitle}</strong>
                      <span>{rv.date}</span>
                    </div>
                    <div className="gray-card-fit">{rv.fitLabel}</div>
                    {rv.text && <p className="gray-card-text">{rv.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* iOS 구글 로그인 시트 */}
        {googleSheetOpen && (
          <div className="overlay-backdrop" role="dialog" aria-modal="true">
            <div className="ios-alert-card">
              {googleStep === 'prompt' && (
                <>
                  <h3 className="ios-alert-title">
                    &apos;wearther&apos;이(가) &apos;account.google.com&apos;을(를) 사용하여
                    로그인하려고 합니다
                  </h3>
                  <p className="ios-alert-msg">
                    이렇게 하면 앱과 웹사이트가 사용자에 대한 정보를 공유할 수 있습니다.
                  </p>
                  <div className="ios-alert-btn-row">
                    <button
                      type="button"
                      className="ios-cancel-btn"
                      onClick={() => setGoogleSheetOpen(false)}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="ios-continue-btn"
                      onClick={() => setGoogleStep('account')}
                    >
                      계속
                    </button>
                  </div>
                </>
              )}

              {googleStep === 'account' && (
                <>
                  <h3 className="ios-alert-title">Google 계정 선택</h3>
                  <p className="ios-alert-msg">옷늘날씨(Today&apos;s WEARther)로 이동</p>
                  <button
                    type="button"
                    className="google-acct-choice"
                    onClick={() => setGoogleStep('consent')}
                  >
                    <strong>wearther.user@gmail.com</strong>
                    <span>계정 선택</span>
                  </button>
                  <button
                    type="button"
                    className="ios-cancel-btn full-w"
                    onClick={() => setGoogleSheetOpen(false)}
                  >
                    취소
                  </button>
                </>
              )}

              {googleStep === 'consent' && (
                <>
                  <h3 className="ios-alert-title">계정 정보 제공 동의</h3>
                  <p className="ios-alert-msg">
                    기본 프로필 정보로 옷늘날씨 온보딩을 시작합니다.
                  </p>
                  <div className="ios-alert-btn-row">
                    <button
                      type="button"
                      className="ios-cancel-btn"
                      onClick={() => setGoogleSheetOpen(false)}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="ios-continue-btn"
                      onClick={() => {
                        setGoogleSheetOpen(false);
                        setScreen('location-perm');
                      }}
                    >
                      동의하고 계속
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 웰컴 바텀시트 */}
        {welcomeSheetOpen && screen === 'home' && (
          <div className="overlay-backdrop bottom-align" role="dialog" aria-modal="true">
            <div className="bottom-sheet-card">
              <span className="eyebrow-sky">WELCOME</span>
              <h3 className="sheet-heading">
                {trimmedNickname || '졸업프로젝트'}님! 옷늘날씨에 오신걸 환영해요
              </h3>
              <p className="sheet-subcopy">날씨에 어울리는 코디를 추천해 드릴게요</p>
              <button
                type="button"
                className="sky-primary-btn"
                onClick={() => setWelcomeSheetOpen(false)}
              >
                시작하기
              </button>
            </div>
          </div>
        )}

        {/* 내 위치 선택 바텀시트 */}
        {locationSheetOpen && (
          <div className="overlay-backdrop bottom-align" role="dialog" aria-modal="true">
            <div className="bottom-sheet-card">
              <div className="sheet-top-bar">
                <strong>내 위치 선택</strong>
                <button
                  type="button"
                  className="close-x-btn"
                  onClick={() => setLocationSheetOpen(false)}
                  aria-label="닫기"
                >
                  ×
                </button>
              </div>

              <input
                type="text"
                className="addr-search-input"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setCandidateRegionId('');
                }}
                placeholder="동, 읍, 면으로 검색해주세요"
              />

              <button
                type="button"
                className="current-gps-btn"
                onClick={handleUseCurrentLocation}
              >
                현재 위치로 설정하기
              </button>

              <div className="addr-result-area">
                {!locationQuery.trim() ? (
                  <div className="addr-empty-center">주소를 검색해주세요</div>
                ) : searchResults.length === 0 ? (
                  <div className="addr-empty-center">일치하는 주소가 없어요</div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`addr-item-btn ${
                        candidateRegionId === item.id ? 'selected' : ''
                      }`}
                      onClick={() => setCandidateRegionId(item.id)}
                    >
                      <strong>{item.dong}</strong>
                      <span>{item.fullAddress}</span>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                className={`sky-primary-btn ${!candidateRegionId ? 'disabled' : ''}`}
                disabled={!candidateRegionId}
                onClick={handleConfirmLocationChange}
              >
                변경
              </button>
            </div>
          </div>
        )}

        {/* 리뷰 등록 완료 다이얼로그 */}
        {reviewDoneModalOpen && (
          <div className="overlay-backdrop" role="dialog" aria-modal="true">
            <div className="ios-alert-card">
              <h3 className="ios-alert-title">
                등록이 완료되었습니다! 작성한 리뷰 확인하시겠어요?
              </h3>
              <div className="ios-alert-btn-row">
                <button
                  type="button"
                  className="ios-cancel-btn"
                  onClick={() => {
                    setReviewDoneModalOpen(false);
                    setScreen('outfit-detail');
                  }}
                >
                  아니오
                </button>
                <button
                  type="button"
                  className="ios-continue-btn"
                  onClick={() => {
                    setReviewDoneModalOpen(false);
                    setScreen('my-reviews');
                  }}
                >
                  마이페이지로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 하단 탭바 */}
        {showBottomBar && (
          <nav className="bottom-nav" aria-label="하단 메뉴">
            <button
              type="button"
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setScreen('home')}
            >
              홈
            </button>
            <button
              type="button"
              className={`nav-item ${activeTab === 'outfit' ? 'active' : ''}`}
              onClick={() => setScreen('outfit-detail')}
            >
              오늘의 추천
            </button>
            <button
              type="button"
              className={`nav-item ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setScreen('my')}
            >
              마이페이지
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}