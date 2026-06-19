import streamlit as st
import json
import os

# ── 페이지 설정 (라이트 테마 레이아웃 최적화) ───────────────────────────
st.set_page_config(page_title="옷늘날씨 WEARther", page_icon="☀️", layout="centered")

# ── 고대비 네온 & 라이트 스타일 디자인 (CSS 추가) ──────────────────────────────
st.markdown("""
<style>
/* 전반적인 라이트/고대비 컴포넌트 커스텀 */
[data-testid="stAppViewContainer"] {
    background-color: #ffffff;
    color: #1f2937;
}
[data-testid="stHeader"] {
    background: rgba(255, 255, 255, 0.8);
}

.main-title { 
    font-size: 40px; 
    font-weight: 900; 
    margin-bottom: 0; 
    background: linear-gradient(90deg, #10b981 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.sub-title { color: #4b5563; font-size: 16px; margin-top: 6px; margin-bottom: 32px; font-weight: 500; }

/* 날씨 대시보드 카드 (Light Glassmorphism) */
.weather-container {
    background: #f0fdf4;
    border: 2px solid #bbf7d0;
    border-radius: 20px; 
    padding: 24px; 
    margin-bottom: 28px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.temp-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
}
.temp-box { text-align: left; }
.temp-big { font-size: 52px; font-weight: 900; color: #111827; line-height: 1; }
.temp-corrected { font-size: 32px; font-weight: 800; color: #059669; }
.temp-label { color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;}

/* 추천 의류 카드 */
.outfit-card {
    background: #fdfdfd; 
    border-left: 4px solid #10b981; 
    border-top: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px; 
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.outfit-type { font-size: 13px; color: #4b5563; font-weight: 700; margin-bottom: 4px; }
.outfit-name { font-size: 18px; color: #111827; font-weight: 800; }

/* 근거 데이터 태그 */
.source-tag {
    display: inline-block; background: #f3f4f6; color: #065f46;
    font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #d1d5db; margin: 2px 4px 2px 0;
}
.style-badge {
    background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;
}

/* Streamlit 기본 텍스트 색상 보정 */
h3 { color: #111827 !important; font-weight: 800 !important; }
div[data-testid="stExpander"] { border: 1px solid #e5e7eb !important; background: #f9fafb; }
</style>
""", unsafe_allow_html=True)

# ── 헤더 영역 ──────────────────────────────────────────────
st.markdown('<p class="main-title">WEARther</p>', unsafe_allow_html=True)
st.markdown('<p class="sub-title">🤖 Human-like 크롤링 & AI 기반 실시간 패션 트렌드 분석 엔진</p>', unsafe_allow_html=True)

# ── 데이터 로드 ──────────────────────────────────────────────
RESULT_PATH = os.path.join(os.path.dirname(__file__), "e2e_result.json")

@st.cache_data
def load_result():
    if not os.path.exists(RESULT_PATH):
        st.error(f"데이터 파일을 찾을 수 없습니다: {RESULT_PATH}")
        return None
    with open(RESULT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

data = load_result()

if data:
    # ── 날씨 정보 대시보드 카드 ───────────────────────────────────────────
    st.markdown(f"""
    <div class="weather-container">
        <div class="temp-label">실시간 기상 스냅샷</div>
        <div class="temp-flex">
            <div class="temp-box">
                <span class="temp-label">현재 실제 기온</span>
                <div class="temp-big">{data['weather_temp']}°C</div>
            </div>
            <div style="border-left: 1px solid #d1d5db; height: 50px;"></div>
            <div class="temp-box">
                <span class="temp-label">🤖 SNS 보정 체감온도</span>
                <div class="temp-corrected">{data['corrected_temp']}°C</div>
            </div>
            <div class="temp-box" style="text-align: right;">
                <span class="temp-label">추천 강도</span>
                <div style="font-size: 18px; font-weight: 700; color: #0284c7; margin-top:4px;">✨ {data['recommendation']['level']}</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── 오늘의 추천 코디 섹션 ───────────────────────────────────────────
    st.markdown("### 🧥 오늘의 추천 코디")
    
    outfit = data["recommendation"]["outfit"]
    icons = {"상의": "👕", "하의": "👖", "아우터": "🧥", "신발": "👟"}

    cols = st.columns(2)
    for i, (part, item) in enumerate(outfit.items()):
        with cols[i % 2]:
            st.markdown(f"""
            <div class="outfit-card" style="border-left-color: {'#10b981' if i%2==0 else '#0ea5e9'};">
                <div class="outfit-type">{icons.get(part, "👔")} {part}</div>
                <div class="outfit-name">{item}</div>
            </div>
            """, unsafe_allow_html=True)

    st.write("")
    st.write("")

    # ── 사용자 피드백 피드 섹션 ───────────────────────────────────────────
    st.markdown("### 💬 이 추천은 어떠셨나요?")
    fb1, fb2, fb3 = st.columns(3)
    
    if "feedback" not in st.session_state:
        st.session_state.feedback = None

    with fb1:
        if st.button("🥶 오늘 기온 대비 추워요", use_container_width=True):
            st.session_state.feedback = "cold"
    with fb2:
        if st.button("👍 딱 알맞은 코디예요", use_container_width=True):
            st.session_state.feedback = "good"
    with fb3:
        if st.button("🥵 오늘 기온 대비 더워요", use_container_width=True):
            st.session_state.feedback = "hot"

    if st.session_state.feedback:
        label = {"cold": "추웠다는", "good": "딱 좋았다는", "hot": "더웠다는"}[st.session_state.feedback]
        st.success(f"데이터 피드백 반영 완료: 가중치 조정 엔진에 '{label}' 피드백이 전송되었습니다.")

    st.write("---")

    # ── 데이터 분석 근거 패널 ───────────────────────────────────────────
    expander_title = f"📊 추천 분석 근거 데이터 (실시간 SNS 크롤링 {len(data['input_posts'])}건 모델 검증)"
    with st.expander(expander_title):
        st.markdown("<p style='color:#374151; font-size:14px; margin-bottom:16px;'>인간형(Human-like) 수집 봇을 통해 인스타그램 백그라운드 데이터셋에서 실시간 추출한 Vision 태깅 결과입니다.</p>", unsafe_allow_html=True)
        
        for i, post in enumerate(data["input_posts"], 1):
            col_left, col_right = st.columns([1, 4])
            
            with col_left:
                st.markdown(f"<div style='font-size:14px; font-weight:800; color:#4b5563; margin-top:4px;'>POST {i:02d}</div>", unsafe_allow_html=True)
                st.markdown(f"<span class='style-badge'>{post['style']}</span>", unsafe_allow_html=True)
                
            with col_right:
                tags = " ".join([f'<span class="source-tag">{t}</span>' for t in post["item"]])
                st.markdown(f"""
                <div style="font-size:14px; color:#111827; margin-bottom:4px;">
                    🎨 <b>주요 색상:</b> {post['color']} | 🎯 <b>신뢰도 점수:</b> <span style="color:#0284c7; font-weight:700;">{post['reliability_score']}pt</span>
                </div>
                <div style="margin-bottom:12px;">{tags}</div>
                """, unsafe_allow_html=True)
            st.markdown("<div style='border-bottom:1px solid #e5e7eb; margin: 8px 0 16px 0;'></div>", unsafe_allow_html=True)

    # ── 푸터 ───────────────────────────────────────────────────────────
    st.caption("공학종합설계프로젝트 1학기 최종 산출물 — WEARther UI Engine v5.0 (Light)")