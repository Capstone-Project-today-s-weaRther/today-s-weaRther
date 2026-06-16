# 옷늘날씨 today-s-weaRther

날씨 기반 패션 추천 서비스

## 팀원
- C111090 신주영
- C211055 나샤론

## 프로젝트 소개
인스타그램에서 패션 이미지를 수집하는 Human-like 크롤링 봇을 기반으로,
오늘의 날씨에 맞는 코디를 추천하는 서비스입니다.

## 기술 스택
- **Crawling**: Python + Playwright
- **DB**: Supabase
- **Scheduler**: APScheduler (2시간 주기 자동 실행)
- **Image Analysis**: Claude Vision API (개발 중)
- **Frontend**: Streamlit (개발 중)

## 폴더 구조
\`\`\`
today-s-weaRther/
├── docs/          # 설계 문서, UML
├── crawler/       # 인스타그램 크롤러
├── analysis/      # 이미지 분류 모듈
├── engine/        # 추천 엔진
├── db/            # DB 스키마
└── prototype/     # Streamlit 앱
\`\`\`

## 개발 현황
- [x] Instagram 자동 로그인 + 팝업 닫기
- [x] 키워드 기반 이미지 수집
- [x] Supabase DB 연동
- [x] APScheduler 자동 스케줄러
- [ ] AI 이미지 분류
- [ ] 추천 엔진
- [ ] 사용자 UI
