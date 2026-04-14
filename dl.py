import urllib.request
import json
req = urllib.request.Request('https://commons.wikimedia.org/w/api.php?action=query&titles=File:Penguin_Random_House.svg&prop=imageinfo&iiprop=url&format=json', headers={'User-Agent': 'Mozilla/5.0'})
u = json.loads(urllib.request.urlopen(req).read())
pages = u['query']['pages']
img_url = list(pages.values())[0]['imageinfo'][0]['url']
req_img = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
with open('assets/penguin_logo.svg', 'wb') as f:
    f.write(urllib.request.urlopen(req_img).read())
