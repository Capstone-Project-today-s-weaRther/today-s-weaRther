-- raw_posts: 크롤링 직후 임시 저장 (분류 전)
CREATE TABLE IF NOT EXISTS raw_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,           -- 'instagram' or 'x'
    image_path TEXT,
    caption TEXT,
    followers INTEGER,
    likes INTEGER,
    comments INTEGER,
    posted_at TEXT,
    collected_at TEXT DEFAULT (datetime('now'))
);

-- analysis_results: Vision API 분류 결과 + 신뢰도 점수 (영구 저장)
CREATE TABLE IF NOT EXISTS analysis_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    style TEXT,
    color TEXT,
    item TEXT,                        -- JSON 배열 문자열로 저장
    reliability_score REAL,
    analyzed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES raw_posts(id)
);

-- weight_results: 보정온도 계산 결과 (영구 저장)
CREATE TABLE IF NOT EXISTS weight_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    weather_temp REAL,
    sns_signal_temp REAL,
    corrected_temp REAL,
    recommended_level TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
