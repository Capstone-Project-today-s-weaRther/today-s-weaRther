from playwright.sync_api import sync_playwright
from supabase import create_client
SUPABASE_URL = " "
SUPABASE_KEY = " "
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
import time
import os
import requests

INSTAGRAM_ID = " "
INSTAGRAM_PW = " "

def crawl_instagram():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 로그인
        page.goto("https://www.instagram.com/accounts/login/")
        page.wait_for_selector('input[name="email"]', timeout=15000)
        time.sleep(2)
        page.fill('input[name="email"]', INSTAGRAM_ID)
        time.sleep(1)
        page.fill('input[name="pass"]', INSTAGRAM_PW)
        time.sleep(1)
        page.keyboard.press('Enter')
        print("로그인 시도중...")
        time.sleep(7)
        
        # 팝업 닫기
        try:
            page.click('text=나중에 하기')
            time.sleep(2)
        except:
            pass
        try:
            page.click('text=나중에 하기')
            time.sleep(2)
        except Exception as e:
                    print(f"에러: {e}")
        print("로그인 완료!")
        
        # 패션 키워드 검색
        page.goto("https://www.instagram.com/explore/search/keyword/?q=오늘코디")
        time.sleep(5)
        
        # 스크롤해서 이미지 로드
        for i in range(3):
            page.evaluate("window.scrollBy(0, 1000)")
            time.sleep(2)
        
        print("페이지 로드 완료!")
        
        # 이미지 수집 (작은 이미지 제외)
        images = page.query_selector_all('img')
        print(f"이미지 {len(images)}개 발견!")
        
        os.makedirs('fashion_images', exist_ok=True)
        
        count = 0
        for img in images:
            src = img.get_attribute('src')
            width = img.get_attribute('width')
            
            # 큰 이미지만 저장 (프로필 사진 제외)
            if src and ('cdninstagram' in src or 'fbcdn' in src) and 's150x150' not in src and 't51' in src:
                try:
                    response = requests.get(src)
                    from datetime import datetime
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    with open(f'fashion_images/{timestamp}_{count}.jpg', 'wb') as f:
                        f.write(response.content)

                    # Supabase에 URL 저장
                    supabase.table('fashion_images').insert({
                        'image_url': src,
                        'keyword': '오늘코디'
                    }).execute()

                    count += 1      
                    print(f"이미지 {count}개 저장 완료!")
                except:
                    pass
        
        print(f"총 {count}개 이미지 저장 완료!")
       
        browser.close()

from apscheduler.schedulers.blocking import BlockingScheduler

scheduler = BlockingScheduler()
scheduler.add_job(crawl_instagram, 'interval', hours=2)
print("스케줄러 시작! 2시간마다 자동 실행돼요.")
crawl_instagram()  # 시작하자마자 한 번 실행
scheduler.start()