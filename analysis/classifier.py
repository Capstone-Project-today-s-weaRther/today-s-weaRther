import os
import base64
import json
from pathlib import Path
from anthropic import Anthropic


def load_env(env_path=".env"):
    with open(env_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()


load_env()
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

IMAGE_PATH = r"C:\Users\Sharon Na\Desktop\fashion_images\20260526_014426_2.jpg"


def encode_image(path):
    data = Path(path).read_bytes()
    b64 = base64.standard_b64encode(data).decode("utf-8")
    suffix = Path(path).suffix.lower()
    media_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}
    return b64, media_map.get(suffix, "image/jpeg")


def classify_image(image_path):
    b64_data, media_type = encode_image(image_path)

    prompt = """이 이미지 속 옷차림을 분석해서 아래 JSON 형식으로만 답해줘. 다른 설명 없이 JSON만 출력해.

{
  "style": "캐주얼 | 포멀 | 스포티 중 하나",
  "color": "주요 색상 (한국어)",
  "item": "상의 | 하의 | 아우터 | 신발 중 해당하는 것 (여러 개면 배열로)"
}"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": b64_data,
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )

    return response.content[0].text


if __name__ == "__main__":
    result_text = classify_image(IMAGE_PATH)
    print("=== Claude 응답 ===")
    print(result_text)

    cleaned = result_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`").replace("json", "", 1).strip()

    try:
        result_json = json.loads(cleaned)
        output_path = Path("analysis") / "result_sample.json"
        output_path.write_text(
            json.dumps(result_json, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"\n결과 저장됨: {output_path}")
    except json.JSONDecodeError:
        print("\nJSON 파싱 실패 — 원문 응답 확인 필요")
