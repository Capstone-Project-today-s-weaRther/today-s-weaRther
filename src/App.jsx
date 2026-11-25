import React, { useEffect, useMemo, useState } from 'react';

const BASE = import.meta.env.BASE_URL || '/';

const assetUrl = (relativePath) => {
  const clean = relativePath.replace(/^\/+/, '');
  return `${BASE}${clean}`;
};

const LOCATIONS = [
  {
    id: 'gangnam',
    label: '서울 강남구 역삼동',
    temp: 18,
    feelsLike: 15,
    high: 19,
    low: 10,
    humidity: 65,
    wind: '2.3 m/s',
    rainProb: '20%',
    condition: '구름많음',
    icon: 'assets/Icon/weather-partly-cloudy-day.svg',
    themeClass: 'theme-cloudy',
  },
  {
    id: 'hongdae',
    label: '서울 마포구 서교동',
    temp: 22,
    feelsLike: 23,
    high: 24,
    low: 13,
    humidity: 48,
    wind: '1.6 m/s',
    rainProb: '10%',
    condition: '맑음',
    icon: 'assets/Icon/weather-sunny-day.svg',
    themeClass: 'theme-sunny',
  },
  {
    id: 'jongno',
    label: '서울 종로구 관철동',
    temp: 13,
    feelsLike: 10,
    high: 15,
    low: 7,
    humidity: 85,
    wind: '3.8 m/s',
    rainProb: '80% (4.0mm)',
    condition: '비',
    icon: 'assets/Icon/weather-rain.svg',
    themeClass: 'theme-rainy',
  },
  {
    id: 'seongsu',
    label: '서울 성동구 성수동2가',
    temp: 2,
    feelsLike: -3,
    high: 4,
    low: -4,
    humidity: 70,
    wind: '4.5 m/s',
    rainProb: '60%',
    condition: '눈',
    icon: 'assets/Icon/weather-snow.svg',
    themeClass: 'theme-snowy',
  },
];

const STREET_TRENDS = [
  { name: '반팔/티셔츠', ratio: 40, img: 'assets/Img/short-sleeve.png' },
  { name: '긴팔/셔츠', ratio: 30, img: 'assets/Img/long-sleeve.png' },
  { name: '자켓/가디건', ratio: 18, img: 'assets/Img/jacket.png' },
  { name: '코트/패딩', ratio: 12, img: 'assets/Img/coat.png' },
];

const CATALOG = [
  {
    id: 'item-1',
    title: '단정한 셔츠 & 슬랙스 코디 세트',
    styleTag: '단정한 오피스룩 · 상의 우선 매칭',
    tempRange: [15, 23],
    deliveryType: 'fast',
    deliveryBadge: '🚀 빠른 배송 (새벽/당일)',
    mall: '쿠팡',
    price: '38,900원',
    img: 'assets/Img/long-sleeve.png',
    url: 'https://www.coupang.com',
  },
  {
    id: 'item-2',
    title: '가벼운 데일리 자켓 & 팬츠',
    styleTag: '깔끔한 환절기 룩 · 바람막이 보정',
    tempRange: [12, 20],
    deliveryType: 'fast',
    deliveryBadge: '🚀 빠른 배송 (직진배송)',
    mall: '네이버 쇼핑',
    price: '44,000원',
    img: 'assets/Img/jacket.png',
    url: 'https://shopping.naver.com',
  },
  {
    id: 'item-3',
    title: '쿨링 코튼 반팔 티셔츠',
    styleTag: '시원한 데일리룩 · 더위 민감 보정',
    tempRange: [21, 35],
    deliveryType: 'regular',
    deliveryBadge: '📦 일반 배송',
    mall: '지그재그',
    price: '24,500원',
    img: 'assets/Img/short-sleeve.png',
    url: 'https://zigzag.kr',
  },
  {
    id: 'item-4',
    title: '보온 롱코트 / 숏패딩',
    styleTag: '든든한 방한 룩 · 추위 민감 보정',
    tempRange: [-20, 12],
    deliveryType: 'regular',
    deliveryBadge: '📦 일반 배송',
    mall: '무신사',
    price: '89,000원',
    img: 'assets/Img/coat.png',
    url: 'https://www.musinsa.com',
  },
];

export default function App() {
  const [step, setStep] = useState('location'); // location | survey | profile | home
  const [selectedLocId, setSelectedLocId] = useState('gangnam');
  const [gender, setGender] = useState('여성');
  const [sensitivity, setSensitivity] = useState('normal'); // cold | normal | hot
  const [sensitiveFactor, setSensitiveFactor] = useState('기온'); // 기온 | 습도 | 바람세기
  const [nickname, setNickname] = useState('웨어러');
  const [feedbackOffset, setFeedbackOffset] = useState(0); // -2(더 시원하게), 0(딱 지금 정도), +2(더 따뜻하게)
  const [myClosetItem, setMyClosetItem] = useState('니트/긴팔 셔츠');
  const [useClosetFirst, setUseClosetFirst] = useState(true);
  const [externalRecs, setExternalRecs] = useState([]);

  useEffect(() => {
    fetch(assetUrl('data/recommendations.json'))
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setExternalRecs(data);
        else if (Array.isArray(data?.items)) setExternalRecs(data.items);
      })
      .catch(() => {});
  }, []);

  const currentLoc = useMemo(
    () => LOCATIONS.find((l) => l.id === selectedLocId) || LOCATIONS[0],
    [selectedLocId]
  );

  const teamLabel = useMemo(() => {
    if (sensitivity === 'hot') return '팀 더워';
    if (sensitivity === 'cold') return '팀 추워';
    return '팀 딱좋아';
  }, [sensitivity]);

  const effectiveFeelsLike = useMemo(() => {
    const sensitivityDelta = sensitivity === 'hot' ? 2 : sensitivity === 'cold' ? -2 : 0;
    return currentLoc.feelsLike + sensitivityDelta + feedbackOffset;
  }, [currentLoc.feelsLike, sensitivity, feedbackOffset]);

  const recommendationComment = useMemo(() => {
    const prefix = useClosetFirst && myClosetItem
      ? `[내 옷장 반영: ${myClosetItem}] `
      : '[기본 추천] ';

    if (effectiveFeelsLike <= 11) {
      return `${prefix}체감 ${effectiveFeelsLike}°C로 쌀쌀/추운 편이에요. 든든한 아우터와 따뜻한 상·하의 조합을 추천해요.`;
    }
    if (effectiveFeelsLike >= 22) {
      return `${prefix}체감 ${effectiveFeelsLike}°C로 따뜻/더운 편이에요. 통기성 좋은 상의와 가벼운 하의를 추천해요.`;
    }
    return `${prefix}체감 ${effectiveFeelsLike}°C로 활동하기 좋아요. 상의 우선 매칭 기준 단정한 룩을 추천해요.`;
  }, [effectiveFeelsLike, useClosetFirst, myClosetItem]);

  const filteredCatalog = useMemo(() => {
    const matched = CATALOG.filter(
      (item) => effectiveFeelsLike >= item.tempRange[0] && effectiveFeelsLike <= item.tempRange[1]
    );
    return matched.length > 0 ? matched : CATALOG;
  }, [effectiveFeelsLike]);

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        {step === 'location' && (
          <section className="screen">
            <div className="brand-header">
              <img src={assetUrl('assets/Icon/weather-sunny-day.svg')} alt="로고" className="brand-icon" />
              <div>
                <h1 className="brand-title">오늘날씨 : Today&apos;s WEARther</h1>
                <p className="brand-sub">1단계 · 기본 위치 설정</p>
              </div>
            </div>

            <h2 className="screen-heading">어느 지역의 날씨를 확인할까요?</h2>
            <div className="option-list">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  className={`option-card ${selectedLocId === loc.id ? 'active' : ''}`}
                  onClick={() => setSelectedLocId(loc.id)}
                >
                  <div>
                    <strong>{loc.label}</strong>
                    <div className="muted-text">{loc.condition} · 습도 {loc.humidity}% · 풍속 {loc.wind}</div>
                  </div>
                  <span className="temp-pill">{loc.temp}°C</span>
                </button>
              ))}
            </div>

            <button type="button" className="primary-btn" onClick={() => setStep('survey')}>
              다음으로
            </button>
          </section>
        )}

        {step === 'survey' && (
          <section className="screen">
            <p className="step-badge">2단계 · 체감 온도 성향 설문</p>
            <h2 className="screen-heading">평소 날씨와 체질을 알려주세요</h2>

            <div className="field-group">
              <label className="field-label">성별</label>
              <div className="chip-row">
                {['여성', '남성', '선택 안 함'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`chip-btn ${gender === g ? 'active' : ''}`}
                    onClick={() => setGender(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">더위/추위 민감도</label>
              <div className="option-list">
                <button
                  type="button"
                  className={`option-card ${sensitivity === 'cold' ? 'active' : ''}`}
                  onClick={() => setSensitivity('cold')}
                >
                  <span>🧊 조금만 추워도 춥게 느껴요</span>
                  <span className="tag-badge">팀 추워</span>
                </button>
                <button
                  type="button"
                  className={`option-card ${sensitivity === 'normal' ? 'active' : ''}`}
                  onClick={() => setSensitivity('normal')}
                >
                  <span>⚖️ 보통이에요</span>
                  <span className="tag-badge">팀 딱좋아</span>
                </button>
                <button
                  type="button"
                  className={`option-card ${sensitivity === 'hot' ? 'active' : ''}`}
                  onClick={() => setSensitivity('hot')}
                >
                  <span>🔥 조금만 더워도 덥게 느껴요</span>
                  <span className="tag-badge">팀 더워</span>
                </button>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">더 민감한 날씨 요소</label>
              <div className="chip-row">
                {['기온', '습도', '바람세기'].map((factor) => (
                  <button
                    key={factor}
                    type="button"
                    className={`chip-btn ${sensitiveFactor === factor ? 'active' : ''}`}
                    onClick={() => setSensitiveFactor(factor)}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>

            <div className="btn-row">
              <button type="button" className="secondary-btn" onClick={() => setStep('location')}>
                이전
              </button>
              <button type="button" className="primary-btn" onClick={() => setStep('profile')}>
                다음으로
              </button>
            </div>
          </section>
        )}

        {step === 'profile' && (
          <section className="screen">
            <p className="step-badge">3단계 · 프로필 설정</p>
            <h2 className="screen-heading">앱에서 사용할 닉네임을 입력해주세요</h2>

            <div className="field-group">
              <label className="field-label" htmlFor="nickname-input">닉네임</label>
              <input
                id="nickname-input"
                type="text"
                className="text-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 웨어러"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="closet-input">내 옷장 보유 아이템 (선택)</label>
              <input
                id="closet-input"
                type="text"
                className="text-input"
                value={myClosetItem}
                onChange={(e) => setMyClosetItem(e.target.value)}
                placeholder="예: 니트, 셔츠, 슬랙스"
              />
            </div>

            <div className="btn-row">
              <button type="button" className="secondary-btn" onClick={() => setStep('survey')}>
                이전
              </button>
              <button type="button" className="primary-btn" onClick={() => setStep('home')}>
                시작하기
              </button>
            </div>
          </section>
        )}

        {step === 'home' && (
          <main className="screen home-screen">
            <header className="top-bar">
              <select
                className="location-select"
                value={selectedLocId}
                onChange={(e) => setSelectedLocId(e.target.value)}
                aria-label="지역 선택"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.label}
                  </option>
                ))}
              </select>
              <button type="button" className="reset-link" onClick={() => setStep('survey')}>
                설문 수정
              </button>
            </header>

            <div className="welcome-banner">
              <strong>어서오세요, {teamLabel} {nickname || '사용자'}님!</strong>
              <span>{gender} · {sensitiveFactor} 민감도 반영 중</span>
            </div>

            <section className={`weather-card ${currentLoc.themeClass}`}>
              <div className="weather-main-row">
                <img src={assetUrl(currentLoc.icon)} alt={currentLoc.condition} className="weather-icon" />
                <div>
                  <div className="current-temp">{currentLoc.temp}°C</div>
                  <div className="feels-temp">
                    보정 체감 {effectiveFeelsLike}°C ({currentLoc.condition})
                  </div>
                </div>
              </div>

              <div className="weather-sub-grid">
                <div>최고 {currentLoc.high}° · 최저 {currentLoc.low}°</div>
                <div>습도 {currentLoc.humidity}%</div>
                <div>풍속 {currentLoc.wind}</div>
                <div>강수 {currentLoc.rainProb}</div>
              </div>
            </section>

            <section className="card-block">
              <div className="section-head">
                <h3>오늘 체감 피드백 (2차 가중치 보정)</h3>
              </div>
              <div className="chip-row">
                <button
                  type="button"
                  className={`chip-btn ${feedbackOffset === -2 ? 'active' : ''}`}
                  onClick={() => setFeedbackOffset(-2)}
                >
                  더 시원하게
                </button>
                <button
                  type="button"
                  className={`chip-btn ${feedbackOffset === 0 ? 'active' : ''}`}
                  onClick={() => setFeedbackOffset(0)}
                >
                  딱 지금 정도
                </button>
                <button
                  type="button"
                  className={`chip-btn ${feedbackOffset === 2 ? 'active' : ''}`}
                  onClick={() => setFeedbackOffset(2)}
                >
                  더 따뜻하게
                </button>
              </div>
            </section>

            <section className="card-block">
              <div className="section-head">
                <h3>지금 이 거리의 옷차림 TOP 4</h3>
                <span className="muted-text">SNS/비전 요약</span>
              </div>
              <div className="trend-grid">
                {STREET_TRENDS.map((t) => (
                  <div key={t.name} className="trend-card">
                    <img src={assetUrl(t.img)} alt={t.name} className="trend-img" />
                    <div className="trend-name">{t.name}</div>
                    <div className="trend-ratio">{t.ratio}%</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-block">
              <div className="section-head">
                <h3>맞춤 의류 추천 &amp; 퀵-커머스</h3>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={useClosetFirst}
                    onChange={(e) => setUseClosetFirst(e.target.checked)}
                  />
                  내 옷장 우선
                </label>
              </div>
              <p className="rec-comment">{recommendationComment}</p>

              <div className="product-list">
                {filteredCatalog.map((item) => (
                  <article
                    key={item.id}
                    className={`product-card ${item.deliveryType === 'fast' ? 'fast-card' : 'regular-card'}`}
                  >
                    <img src={assetUrl(item.img)} alt={item.title} className="product-img" />
                    <div className="product-body">
                      <span className={`delivery-pill ${item.deliveryType}`}>
                        {item.deliveryBadge}
                      </span>
                      <h4 className="product-title">{item.title}</h4>
                      <div className="product-meta">{item.styleTag}</div>
                      <div className="product-bottom">
                        <strong>{item.price}</strong>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="buy-link"
                        >
                          {item.mall} 구매 →
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {externalRecs.length > 0 && (
                <p className="muted-text" style={{ marginTop: '10px' }}>
                  연동된 recommendations.json 항목: {externalRecs.length}건 확인됨
                </p>
              )}
            </section>
          </main>
        )}
      </div>
    </div>
  );
}