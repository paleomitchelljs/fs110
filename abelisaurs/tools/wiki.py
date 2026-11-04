#!/usr/bin/env python3
"""Find and fetch pictures from Wikimedia Commons, with licence and author.
  python3 tools/wiki.py search "Rugops"            # lists files: title, size, licence, author
  python3 tools/wiki.py get "File:Rugops.jpg" out.jpg [width]   # width must be a standard step (e.g. 960, 1280, 1920)
Keep the author and licence for the readme's credits. CC BY and CC BY-SA need credit; public domain and CC0 do not."""
import json, re, subprocess, sys, time
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'fs110-lecture-deck/1.0 (teaching)'
def api(**kw):
    cmd = ['curl', '-s', '-m', '40', '-A', UA, '-G', API] + sum([['--data-urlencode', '%s=%s' % kv] for kv in kw.items()], [])
    for wait in (0, 6, 15, 30):
        time.sleep(wait)
        out = subprocess.check_output(cmd)
        try:
            d = json.loads(out)
            if 'query' in d: return d
        except ValueError:
            pass   # Commons rate-limits quick repeats with an empty or HTML reply; wait and try again
    sys.exit('Commons did not answer; try again in a minute')
def info(titles, width=1920):
    d = api(action='query', prop='imageinfo', iiprop='url|size|extmetadata', iiurlwidth=str(width), format='json', titles='|'.join(titles))
    return d['query']['pages'].values()
if sys.argv[1] == 'search':
    r = api(action='query', list='search', srsearch=sys.argv[2], srnamespace='6', srlimit='20', format='json')['query']['search']
    titles = [x['title'] for x in r if x['title'].lower().endswith(('.jpg', '.jpeg', '.png', '.svg'))]
    for p in info(titles[:20]):
        i = p['imageinfo'][0]; m = i['extmetadata']
        print('%-60s %5dx%-5d %-14s %s' % (p['title'][:78], i['width'], i['height'], m.get('LicenseShortName', {}).get('value', '?')[:14], re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', ''))[:40]))
else:
    title, out = sys.argv[2], sys.argv[3]; width = int(sys.argv[4]) if len(sys.argv) > 4 else 1920
    p = list(info([title], width))[0]['imageinfo'][0]
    subprocess.check_call(['curl', '-s', '-L', '-A', UA, '-o', out, p['thumburl'] if p['width'] > width else p['url']])
    m = p['extmetadata']; print('saved', out, '|', m.get('LicenseShortName', {}).get('value'), '|', re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', ''))[:80])
