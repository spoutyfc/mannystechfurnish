# Read-only homepage probe for prospect research. Usage: PYTHONIOENCODING=utf-8 python site-probe.py URL [URL...]
# Fetches the homepage and robots.txt once each; never submits forms or follows logins.
import sys, re, time, urllib.request, urllib.parse, gzip, ssl, collections
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
ctx=ssl.create_default_context()
def get(u):
    r=urllib.request.Request(u,headers={"User-Agent":UA,"Accept-Encoding":"gzip"})
    t=time.time()
    try:
        with urllib.request.urlopen(r,timeout=25,context=ctx) as resp:
            b=resp.read()
            if resp.headers.get("Content-Encoding")=="gzip": b=gzip.decompress(b)
            return resp.status, resp.geturl(), time.time()-t, b.decode("utf-8","replace"), dict(resp.headers)
    except Exception as e:
        return "ERR "+str(e)[:80], u, time.time()-t, "", {}
for u in sys.argv[1:]:
    st,fin,dt,h,hd=get(u)
    print("===",u,"| status",st,"| final",fin,"| %.2fs | %dKB"%(dt,len(h)//1024))
    if not h: continue
    p=urllib.parse.urlsplit(fin); base=p.scheme+"://"+p.netloc
    st2,_,_,rb,_=get(base+"/robots.txt")
    print(" robots:", " ".join(l.strip() for l in rb.splitlines() if re.match(r'(?i)(user-agent|disallow)',l))[:160] if st2==200 else st2)
    low=h.lower()
    plat=collections.Counter(m for m in re.findall(r'wp-content|static\.wixstatic|wix\.com|squarespace|weebly|img1\.wsimg|godaddy|shopify|webflow|duda|hibu|elementor-|themes/divi|themes/avada|wpbakery|joomla|drupal',low))
    print(" platform:",dict(plat), "| server:",hd.get("Server",""), hd.get("X-Powered-By",""))
    print(" generator:",re.findall(r'<meta[^>]*name=["\']generator["\'][^>]*content=["\']([^"\']*)',h,re.I)[:2])
    print(" title:",(re.findall(r'<title[^>]*>(.*?)</title>',h,re.I|re.S) or [''])[0].strip()[:120])
    print(" desc:",(re.findall(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)',h,re.I) or ['NONE'])[0][:160])
    print(" viewport:",bool(re.search(r'name=["\']viewport',h,re.I)), "| https:",fin.startswith("https"))
    h1=[re.sub(r'<[^>]+>|\s+',' ',x).strip()[:80] for x in re.findall(r'<h1[^>]*>(.*?)</h1>',h,re.I|re.S)]
    print(" h1:",h1[:3])
    imgs=re.findall(r'<img\b[^>]*>',h,re.I); noalt=[i for i in imgs if not re.search(r'alt=["\'][^"\']+',i,re.I)]
    print(" imgs:",len(imgs),"no-alt:",len(noalt))
    print(" schema:",sorted(set(re.findall(r'"@type"\s*:\s*"([A-Za-z]+)"',h)))[:8])
    print(" copyright:",[re.sub(r'\s+',' ',x)[:50] for x in re.findall(r'(?:©|&copy;|&#169;|copyright)[^<]{0,45}',h,re.I)][:2])
    print(" tel:",sorted(set(re.findall(r'tel:([0-9+().\- ]{7,20})',h)))[:3], "| mailto:",sorted(set(re.findall(r'mailto:([^"?\'> ]+)',h)))[:3])
    print(" lic:",sorted(set(re.findall(r'(?i)(?:lic(?:ense)?\.?\s*(?:no\.?|#)?\s*:?\s*#?\s*\d{5,7}|cslb[^<]{0,25}|\b(?:RCE|PE|SE|GE|PLS|LS|CE)\s*(?:No\.?|#)?\s*\d{3,6}\b)',h)))[:6])
    yrs=sorted(set(re.findall(r'\b(20[0-2]\d)\b',h)))
    print(" years-in-html:",yrs[-6:])
    links=sorted(set(l for l in re.findall(r'href=["\']([^"\'#]+)',h) if not re.search(r'\.(css|js|png|jpe?g|svg|ico|woff2?|webp|xml)(\?|$)|wp-json|xmlrpc|fonts\.g|feed',l)))
    print(" links(%d):"%len(links)," ".join(l[:90] for l in links[:45]))
