"""
보정온도 → 코디 매핑 모듈 (5단계)
"""

TEMP_LEVELS = [
    (-100, 4, "매우추움"),
    (5, 11, "추움"),
    (12, 19, "적당"),
    (20, 26, "더움"),
    (27, 100, "매우더움"),
]

OUTFIT_MAP = {
    "매우추움": {"상의": "기모 니트/긴팔", "하의": "기모 바지", "아우터": "패딩/롱코트", "신발": "방한 부츠"},
    "추움":     {"상의": "긴팔 셔츠", "하의": "긴바지", "아우터": "코트/자켓", "신발": "운동화/부츠"},
    "적당":     {"상의": "긴팔/얇은 니트", "하의": "긴바지", "아우터": "가벼운 가디건", "신발": "운동화"},
    "더움":     {"상의": "반팔", "하의": "면바지/슬랙스", "아우터": "없음", "신발": "운동화/샌들"},
    "매우더움": {"상의": "반팔/민소매", "하의": "반바지", "아우터": "없음", "신발": "샌들"},
}


def get_temp_level(corrected_temp: float) -> str:
    for low, high, label in TEMP_LEVELS:
        if low <= corrected_temp <= high:
            return label
    return "적당"


def recommend_outfit(corrected_temp: float) -> dict:
    level = get_temp_level(corrected_temp)
    return {"level": level, "outfit": OUTFIT_MAP[level]}


if __name__ == "__main__":
    result = recommend_outfit(corrected_temp=15.4)
    print(result)
