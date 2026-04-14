import os
import re
import json
import urllib.request
from urllib.error import HTTPError
from playwright.sync_api import sync_playwright

categories_urls = {
    "The Crow Girl": "https://charlottewoo1984.wixsite.com/my-site/the-crow-girl",
    "Kidlitart": "https://charlottewoo1984.wixsite.com/my-site/kidlitart",
    "Pray for Ukraine": "https://charlottewoo1984.wixsite.com/my-site/pray-for-ukraine",
    "Apocalyptic": "https://charlottewoo1984.wixsite.com/my-site/apocalyptic",
    "My Friend Is An Angel": "https://charlottewoo1984.wixsite.com/my-site/my-friend-is-an-angel",
    "Clay Artworks": "https://charlottewoo1984.wixsite.com/my-site/clay-artworks",
    "Random Art": "https://charlottewoo1984.wixsite.com/my-site/random-art",
    "Fan Art": "https://charlottewoo1984.wixsite.com/my-site/fan-art",
    "The Demon's Coming": "https://charlottewoo1984.wixsite.com/my-site/the-demon-s-coming",
    "Secret Garden": "https://charlottewoo1984.wixsite.com/my-site/secret-garden"
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PORTFOLIO_DIR = os.path.join(BASE_DIR, 'assets', 'portfolio')

def main():
    if not os.path.exists(PORTFOLIO_DIR):
        os.makedirs(PORTFOLIO_DIR)
        
    portfolio_data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for category_name, url in categories_urls.items():
            dir_name = re.sub(r'[^A-Za-z0-9]+', '-', category_name).strip('-').lower()
            cat_dir = os.path.join(PORTFOLIO_DIR, dir_name)
            if not os.path.exists(cat_dir):
                os.makedirs(cat_dir)
            
            print(f"Scraping category: {category_name}")
            try:
                page.goto(url, wait_until="load", timeout=60000)
                page.wait_for_timeout(3000)
                
                # Scroll a few times to trigger lazy loaded wix pro-gallery images
                for _ in range(4):
                    page.evaluate("window.scrollBy(0, 800)")
                    page.wait_for_timeout(1000)
                
                # Extract any img tags or div backgrounds
                imgs = page.evaluate('''() => {
                    const allImgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
                    const allDivs = Array.from(document.querySelectorAll('div')).map(div => div.style.backgroundImage).filter(bg => bg.includes('url(')).map(bg => bg.replace('url("', '').replace('")', ''));
                    return [...allImgs, ...allDivs].filter(src => src.includes('wixstatic.com/media'));
                }''')
                
                image_sources = []
                for src in imgs:
                    # Captures the wix ~mv2 dynamic hash image file
                    match = re.search(r'media/([^/]+\~mv2\.(?:jpg|jpeg|png|webp|gif))', src)
                    if match:
                        base_filename = match.group(1)
                        image_sources.append(base_filename)

                image_sources = list(set(image_sources))
                print(f"Found {len(image_sources)} images for {category_name}.")
                
                downloaded_paths = []
                for i, filename in enumerate(image_sources):
                    dl_url = f"https://static.wixstatic.com/media/{filename}"
                    ext = filename.split('.')[-1]
                    local_filename = f"{i+1}.{ext}"
                    local_path = os.path.join(cat_dir, local_filename)
                    relative_path = f"assets/portfolio/{dir_name}/{local_filename}"
                    
                    req = urllib.request.Request(dl_url, headers={'User-Agent': 'Mozilla/5.0'})
                    try:
                        with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
                            out_file.write(response.read())
                            downloaded_paths.append(relative_path)
                    except Exception as e:
                        print(f"Error downloading {dl_url}: {e}")
                            
                portfolio_data.append({
                    "id": dir_name,
                    "title": category_name,
                    "images": downloaded_paths
                })
                
            except Exception as ex:
                print(f"Error processing {category_name}: {ex}")

        browser.close()

    # Save mapping logic as JSON and inject as JS
    json_data = json.dumps(portfolio_data, indent=4, ensure_ascii=False)
    with open(os.path.join(PORTFOLIO_DIR, 'portfolio_data.json'), 'w', encoding='utf-8') as f:
        f.write(json_data)
        
    with open(os.path.join(PORTFOLIO_DIR, 'portfolio_data.js'), 'w', encoding='utf-8') as f:
        f.write(f'window.PORTFOLIO_DATA = {json_data};')

    print("Scraping completed! Data saved to portfolio_data.js")

if __name__ == "__main__":
    main()
