"""
SNS/날씨 가중치 계산 모듈
날씨(실측값) 60% : SNS(크라우드 신호) 40% 비중으로 보정온도 산출.
"""

WEATHER_WEIGHT = 0.6
SNS_WEIGHT = 0.4

# 옷 종류별 예상 적정 온도 (대략적인 기준)
ITEM_TEMP_ESTIMATE = {
    "아우터": 8,
    "긴팔": 15,
    "반팔": 24,
    "하의(긴바지)": 15,
    "하의(반바지)": 25,
}


def calculate_sns_temp(posts: list[dict]) -> float | None:
    """
    posts: [{"item": ["상의", "아우터"], "reliability_score": 75.0}, ...]
    각 게시물의 신뢰도 점수로 가중 평균한 추정 온도 반환.
    """
    weighted_sum = 0
    total_weight = 0

    for post in posts:
        score = post.get("reliability_score", 0)
        items = post.get("item", [])
        if isinstance(items, str):
            items = [items]

        for item in items:
            temp_guess = ITEM_TEMP_ESTIMATE.get(item)
            if temp_guess is not None:
                weighted_sum += temp_guess * score
                total_weight += score

    if total_weight == 0:
        return None
    return round(weighted_sum / total_weight, 1)


def calculate_corrected_temp(weather_temp: float, posts: list[dict]) -> float:
    """날씨 실측값 + SNS 보정 신호 → 보정온도 산출"""
    sns_temp = calculate_sns_temp(posts)
    if sns_temp is None:
        return weather_temp
    return round(WEATHER_WEIGHT * weather_temp + SNS_WEIGHT * sns_temp, 1)


if __name__ == "__main__":
    sample_posts = [
        {"item": ["아우터", "긴팔"], "reliability_score": 75.0},
        {"item": ["반팔"], "reliability_score": 40.0},
    ]
    corrected = calculate_corrected_temp(weather_temp=18.0, posts=sample_posts)
    print(f"보정온도: {corrected}도")
