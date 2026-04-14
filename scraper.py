import re
import urllib.request
import json

urls = [
    "https://charlottewoo1984.wixsite.com/my-site/the-crow-girl",
    "https://charlottewoo1984.wixsite.com/my-site/kidlitart",
    "https://charlottewoo1984.wixsite.com/my-site/pray-for-ukraine",
    "https://charlottewoo1984.wixsite.com/my-site/apocalyptic",
    "https://charlottewoo1984.wixsite.com/my-site/my-friend-is-an-angel",
    "https://charlottewoo1984.wixsite.com/my-site/clay-artworks",
    "https://charlottewoo1984.wixsite.com/my-site/random-art",
    "https://charlottewoo1984.wixsite.com/my-site/fan-art",
    "https://charlottewoo1984.wixsite.com/my-site/the-demon-s-coming",
    "https://charlottewoo1984.wixsite.com/my-site/secret-garden"
]

results = {}

for url in urls:
    cat_name = url.split('/')[-1]
    results[cat_name] = []
    try:
        html = urllib.request.urlopen(url).read().decode('utf-8')
        # Wix usually puts image data in a global json payload 
        # Search for patterns like wixstatic.com/media/xxxx.jpg or just media files
        # It's usually "uri":"someid.jpg" or "id":"someid.jpg"
        images = set(re.findall(r'[\w\-]+\.(?:jpg|jpeg|png|webp|gif)', html))
        # Filter typical wix garbage
        images = {img for img in images if len(img) > 10 and not img.startswith('wix_') and not img.startswith('core')}
        results[cat_name] = list(images)
        print(f"Extracted {len(images)} distinct media names for {cat_name}")
    except Exception as e:
        print(f"Error fetching {url}: {e}")

with open('scraper_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=4)
