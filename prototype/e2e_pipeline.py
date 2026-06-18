"""
E2E 파이프라인: 크롤러 이미지 → Vision 분류 → 신뢰도/가중치 → 추천 결과 출력
"""

import json
import glob
from pathlib import Path

from analysis.classifier import classify_image
from analysis.reliability import calculate_reliability_score
from engine.weather import get_current_temperature
from engine.weights import calculate_corrected_temp
from engine.recommend import recommend_outfit


IMAGE_DIR = r"C:\Users\Sharon Na\Desktop\fashion_images"

# 크롤러의 팔로워/좋아요 메타데이터 자동 수집은 방학 작업 예정 → 데모용 샘플값
SAMPLE_METADATA = {"followers": 50000, "likes": 3000}


def parse_classification(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`").replace("json", "", 1).strip()
    return json.loads(cleaned)


def run_pipeline(image_dir: str = IMAGE_DIR, max_images: int = 3):
    image_paths = sorted(glob.glob(f"{image_dir}\\*.jpg")) + sorted(glob.glob(f"{image_dir}\\*.png"))
    image_paths = image_paths[:max_images]

    if not image_paths:
        raise FileNotFoundError(f"{image_dir} 안에 이미지가 없음")

    print(f"=== 1단계: 크롤러 이미지 {len(image_paths)}건 로드 ===")
    for p in image_paths:
        print(f"  - {p}")

    posts = []
    print("\n=== 2단계: Vision API 분류 ===")
    for path in image_paths:
        raw = classify_image(path)
        result = parse_classification(raw)
        score = calculate_reliability_score(
            followers=SAMPLE_METADATA["followers"],
            likes=SAMPLE_METADATA["likes"],
            platform="instagram",
        )
        result["reliability_score"] = score
        result["image"] = path
        posts.append(result)
        print(f"  {Path(path).name}: {result}")

    print("\n=== 3단계: 실시간 날씨 조회 ===")
    weather_temp = get_current_temperature()
    print(f"  현재 서울 기온: {weather_temp}도")

    print("\n=== 4단계: 가중치 적용 보정온도 계산 ===")
    corrected_temp = calculate_corrected_temp(weather_temp, posts)
    print(f"  보정온도: {corrected_temp}도")

    print("\n=== 5단계: 코디 추천 ===")
    recommendation = recommend_outfit(corrected_temp)
    print(f"  추천 결과: {recommendation}")

    final_result = {
        "input_posts": posts,
        "weather_temp": weather_temp,
        "corrected_temp": corrected_temp,
        "recommendation": recommendation,
    }

    output_path = Path("prototype") / "e2e_result.json"
    output_path.write_text(
        json.dumps(final_result, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\n결과 저장됨: {output_path}")

    return final_result


if __name__ == "__main__":
    run_pipeline()
