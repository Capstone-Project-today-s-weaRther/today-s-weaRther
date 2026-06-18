"""
신뢰도 점수 모듈
현재: 인스타그램 게시물의 팔로워 수 + 좋아요 비율 기반으로 계산.
TODO: X(트위터) 크롤러 추가 시 PLATFORM_WEIGHT로 실시간성 가중치 차등 적용.
"""

PLATFORM_WEIGHT = {
    "instagram": 1.0,
    "x": 1.5,  # 향후 X 추가 시 실시간 정보 가중치 (방학 작업)
}


def calculate_reliability_score(followers: int, likes: int, platform: str = "instagram") -> float:
    """
    팔로워 수와 좋아요 비율을 기반으로 신뢰도 점수(0~100대) 산정.
    팔로워가 많을수록(유명 계정), 좋아요 비율이 높을수록(화제성) 점수 상승.
    """
    normalized_followers = min(followers / 100000, 1) * 100
    engagement_rate = min(likes / followers, 0.1) * 1000 if followers > 0 else 0

    base_score = 0.5 * normalized_followers + 0.5 * engagement_rate
    weighted_score = base_score * PLATFORM_WEIGHT.get(platform, 1.0)

    return round(weighted_score, 2)


if __name__ == "__main__":
    # 테스트: 팔로워 5만, 좋아요 3천인 인스타 게시물
    score = calculate_reliability_score(followers=50000, likes=3000, platform="instagram")
    print(f"신뢰도 점수: {score}")
