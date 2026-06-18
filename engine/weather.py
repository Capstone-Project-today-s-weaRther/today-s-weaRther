"""
기상청 초단기실황 API — 현재 기온 조회
"""

import os
import requests
from datetime import datetime, timedelta
from urllib.parse import unquote


def load_env(env_path=".env"):
    with open(env_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()


load_env()
SERVICE_KEY = unquote(os.environ["KMA_API_KEY"])
NX, NY = 60, 127  # 서울 종로구 기준 격자 좌표


def get_base_datetime():
    now = datetime.now()
    if now.minute < 40:
        now -= timedelta(hours=1)
    base_date = now.strftime("%Y%m%d")
    base_time = now.strftime("%H00")
    return base_date, base_time


def get_current_temperature() -> float:
    base_date, base_time = get_base_datetime()
    url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
    params = {
        "serviceKey": SERVICE_KEY,
        "dataType": "JSON",
        "numOfRows": "10",
        "pageNo": "1",
        "base_date": base_date,
        "base_time": base_time,
        "nx": NX,
        "ny": NY,
    }

    response = requests.get(url, params=params, timeout=10)

    try:
        data = response.json()
    except ValueError:
        print("JSON 파싱 실패. 응답 원문:")
        print(response.text[:500])
        raise

    items = data["response"]["body"]["items"]["item"]
    for item in items:
        if item["category"] == "T1H":
            return float(item["obsrValue"])

    raise ValueError("T1H(기온) 항목을 찾을 수 없음")


if __name__ == "__main__":
    temp = get_current_temperature()
    print(f"현재 서울 기온: {temp}도")
