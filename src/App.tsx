import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const I = {
  s: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2"/></svg>',
  add: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18 10l-4-4L4 16z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  mah: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  omb: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  sav: '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="20" r="1.6" fill="currentColor"/><circle cx="18" cy="20" r="1.6" fill="currentColor"/><path d="M2 3h3l2.5 13h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  st: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4m6 16v-7m6 7v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  qz: '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" stroke-width="2"/><path d="M5 6v6c0 1.6 3.1 3 7 3s7-1.4 7-3V6M5 12v5c0 1.6 3.1 3 7 3s7-1.4 7-3v-5" stroke="currentColor" stroke-width="2"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
}

const pc = (e: string, n: string, i: number, q: number, k: string, so: string) =>
  '<div class="pc"><div class="pc-main"><div class="p-thumb">' + e + '</div><div class="pc-info"><div class="pc-name">' + n + '</div><div class="pc-sub">#' + i + ' · Joriy qoldiq: ' + q + '</div><div class="pc-stat"><i></i>Mavjud</div></div><div class="pc-prices"><div class="pc-pr"><div class="v">' + k + '</div><div class="l">Kelish</div></div><div class="pc-pr"><div class="v">' + so + '</div><div class="l">Sotish</div></div></div></div><div class="pc-act"><div class="e">' + I.edit + 'Tahrirlash</div><div class="a">' + I.add + 'Qo\'shish</div></div></div>'

const omc = (e: string, n: string, i: number, p: string, bd: string, b: number, q: number, s: number, extra = '') => {
  const col = bd === 'Bor' ? 'var(--emerald)' : bd === 'Kam' ? '#F59E0B' : 'var(--rose)'
  return '<div class="inv-card"><div class="inv-top"><div class="p-thumb" style="width:36px;height:36px;font-size:16px">' + e + '</div><div class="pc-info"><div class="pc-name">#' + i + ' ' + n + '</div><div class="pc-sub">' + p + ' so\'m</div></div><span class="inv-badge" style="background:' + col + '28;color:' + col + '"><i style="background:' + col + '"></i>' + bd + '</span></div><div class="inv-q"><div class="qi"><div class="l">Boshlang\'ich</div><div class="v">' + b + '</div></div><div class="sep"></div><div class="qi"><div class="l">Qoldiq</div><div class="v">' + q + '</div></div><div class="sep"></div><div class="qi"><div class="l">Sotilgan</div><div class="v" style="color:var(--emerald)">' + s + '</div></div></div>' + extra + '</div>'
}

const sale = (e: string, n: string, p: number, q: number, c: number) => {
  const tot = c > 0 ? '<div class="sale-tot">' + (c * p).toLocaleString('uz-UZ') + ' so\'m</div>' : ''
  return '<div class="sale-row' + (c > 0 ? ' sel' : '') + '"><div class="sale-main"><div class="p-thumb" style="width:36px;height:36px;font-size:16px">' + e + '</div><div class="pc-info"><div class="pc-name">' + n + '</div><div class="pc-sub">' + p.toLocaleString('uz-UZ') + ' so\'m · Qoldiq: ' + q + '</div></div><div class="stepper"><b>−</b><span class="qn">' + c + '</span><b>+</b></div></div>' + tot + '</div>'
}

const deb = (l: string, n: string, ph: string, a: string, g: string) =>
  '<div class="deb-card"><div class="deb-av" style="background:' + g + '">' + l + '</div><div class="deb-info"><div class="deb-name">' + n + '</div><div class="deb-phone">' + ph + '</div></div><div class="deb-amt">' + a + '<br><span style="font-size:9px;color:var(--faint);font-weight:600">so\'m</span></div></div>'

const omDetail = '<div class="inv-det"><div class="c"><div class="l">Tushum</div><div class="v">60 000</div></div><div class="c"><div class="l">Qoldiq qiymati</div><div class="v">576 000</div></div><div class="c"><div class="l">Birlik foyda</div><div class="v g">2 200</div></div></div>'

const screens = [
  '<div class="appscreen active"><div class="scr-title">Mahsulotlar</div><div class="scr-head" style="padding-top:0"><div class="scr-search">' + I.s + 'Qidirish...</div><div class="scr-ic lock">' + I.lock + '</div><div class="scr-ic add">' + I.add + '</div></div><div class="scr-body">' + pc('🍫', 'snikers', 1, 48, '9 800', '12 000') + pc('🍟', 'lays', 2, 113, '9 000', '15 000') + pc('⚡', 'flash', 3, 25, '9 800', '15 000') + '</div></div>',
  '<div class="appscreen"><div class="scr-title">Ombor</div><div class="om-date"><div class="d">‹  30 May 2026  ›</div><div class="w">Saturday</div></div><div class="scr-body"><div class="om-sum"><div class="c"><div class="l">Boshlang\'ich</div><div class="v">247</div></div><div class="c"><div class="l">Qoldiq</div><div class="v">228</div></div><div class="c"><div class="l">Sotilgan</div><div class="v g">19</div></div><div class="c"><div class="l">Foyda</div><div class="v g">87 000</div></div></div>' + omc('🍫', 'snikers', 1, '12 000', 'Bor', 53, 48, 5, omDetail) + omc('🍟', 'lays', 2, '15 000', 'Bor', 117, 113, 4) + '</div></div>',
  '<div class="appscreen"><div class="scr-head"><div class="scr-search">' + I.s + 'Qidirish...</div></div><div style="padding:0 14px 8px;color:var(--faint);font-size:11px;font-weight:600">Bugungi kun uchun tez savdo</div><div class="scr-body">' + sale('🍫', 'snikers', 12000, 48, 1) + sale('🍟', 'lays', 15000, 113, 2) + sale('⚡', 'flash', 15000, 25, 0) + sale('🥤', 'gorilla', 15000, 18, 0) + '</div><div class="cart-bar"><div class="ct">Jami · 3 sotilgan</div><div class="cv">42 000 so\'m</div><div class="row"><div class="b1">Bekor</div><div class="scan">' + I.scan + '</div><div class="b2">Sotish</div></div></div></div>',
  '<div class="appscreen"><div class="scr-title">Statistika</div><div class="scr-body">' +
  '<div class="seg"><div class="s">Kun</div><div class="s on">Oy</div><div class="s">Yil</div></div>' +
  '<div class="stat-actions"><div class="ab"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Yuklab olish (CSV)</div><div class="ab"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Barcha vaqt</div></div>' +
  '<div class="stat-hero"><div class="l">Jami tushum</div><div class="big">13 277 000 so\'m</div><div class="row"><div class="c"><div class="l">Sotilgan dona</div><div class="v">954</div></div><div class="c"><div class="l">Sof foyda</div><div class="v g">4 441 470</div></div><div class="c"><div class="l">Marja</div><div class="v g">33%</div></div></div></div>' +
  '<div class="stat-grid"><div class="h">May 2026</div>' +
  '<div class="g2"><div class="c"><div class="l">Jami sotiladigan dona</div><div class="v">1182</div></div><div class="c"><div class="l">Sotilgan dona</div><div class="v">954</div></div></div>' +
  '<div class="g2" style="margin-top:9px"><div class="c"><div class="l">Jami sotish qiymati</div><div class="v">16 577 000</div></div><div class="c"><div class="l">Sotilgan qiymat</div><div class="v">13 277 000</div></div></div>' +
  '<div class="g2" style="margin-top:9px"><div class="c"><div class="l">Qolgan potensial foyda</div><div class="v g">5 568 670</div></div><div class="c"><div class="l">Olingan foyda</div><div class="v g">4 441 470</div></div></div>' +
  '<div class="g2" style="margin-top:9px"><div class="c"><div class="l">Qolgan dona</div><div class="v">228</div></div><div class="c"><div class="l">Qolgan qiymat</div><div class="v r">3 300 000</div></div></div>' +
  '</div>' +
  '<div class="rk"><div class="h">Top mahsulotlar reytingi</div>' +
  '<div class="rk-row"><span class="rk-n top">1</span><span class="rk-nm">lays</span><span class="rk-q">320 ta</span><span class="rk-p">+1.9M</span></div>' +
  '<div class="rk-row"><span class="rk-n top">2</span><span class="rk-nm">snikers</span><span class="rk-q">264 ta</span><span class="rk-p">+1.4M</span></div>' +
  '<div class="rk-row"><span class="rk-n top">3</span><span class="rk-nm">flash</span><span class="rk-q">198 ta</span><span class="rk-p">+0.9M</span></div>' +
  '<div class="rk-row"><span class="rk-n">4</span><span class="rk-nm">gorilla</span><span class="rk-q">112 ta</span><span class="rk-p">+0.6M</span></div>' +
  '</div>' +
  '</div></div>',
  '<div class="appscreen"><div class="scr-head"><div class="scr-search">' + I.s + 'Qidirish...</div></div><div class="scr-title" style="padding-top:0">Qarzdorlar</div><div class="scr-body">' + deb('A', 'Akmal aka', '+998 90 123 45 67', '450 000', 'linear-gradient(135deg,var(--violet),var(--violet-deep))') + deb('D', 'Dilshod', '+998 91 234 56 78', '280 000', 'linear-gradient(135deg,#C99B4E,#E6C079)') + deb('S', 'Sardor', '+998 93 345 67 89', '120 000', 'linear-gradient(135deg,#34D399,#059669)') + '</div><div class="deb-foot">+ Qarzdor qo\'shish</div></div>'
]

const tabsHtml = '<div class="scr-tabs">' +
  '<div class="tab on" data-tab="0">' + I.mah + 'Mahsulotlar</div>' +
  '<div class="tab" data-tab="1">' + I.omb + 'Ombor</div>' +
  '<div class="tab" data-tab="2">' + I.sav + 'Savdo</div>' +
  '<div class="tab" data-tab="3">' + I.st + 'Statistika</div>' +
  '<div class="tab" data-tab="4">' + I.qz + 'Qarzdorlar</div></div>'

function AppPhone({ idx: pi }: { idx: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scr = ref.current
    if (!scr) return
    scr.innerHTML = '<div class="scr-status"><span>9:41</span><div class="dots"><i></i><i></i><i></i></div></div><div class="scr-screens">' + screens.join('') + '</div>' + tabsHtml
    const tabs = scr.querySelectorAll<HTMLElement>('.tab')
    const scrs = scr.querySelectorAll<HTMLElement>('.appscreen')
    let auto = true
    const go = (i: number) => {
      tabs.forEach(t => t.classList.toggle('on', +t.dataset.tab! === i))
      scrs.forEach((s, si) => s.classList.toggle('active', si === i))
    }
    tabs.forEach(t => t.addEventListener('click', () => { auto = false; go(+t.dataset.tab!) }))
    let i = pi % 5
    const timer = setInterval(() => {
      if (!auto) { clearInterval(timer); return }
      i = (i + 1) % tabs.length
      go(i)
    }, 2800 + pi * 500)
    return () => clearInterval(timer)
  }, [pi])
  return <div ref={ref} className="scr"></div>
}

function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    const nav = document.getElementById('nav')
    const scrollHandler = () => nav?.classList.toggle('scrolled', scrollY > 20)
    addEventListener('scroll', scrollHandler)

    const burger = document.getElementById('burger')
    burger?.addEventListener('click', () => {
      const l = document.querySelector<HTMLElement>('.nav-links')
      if (l) l.style.cssText = 'display:flex;position:absolute;top:70px;left:16px;right:16px;flex-direction:column;background:rgba(14,11,26,.97);border:1px solid var(--line);border-radius:20px;padding:20px;gap:16px;backdrop-filter:blur(16px)'
    })
    document.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => {
        if (innerWidth <= 980) {
          const l = document.querySelector<HTMLElement>('.nav-links')
          if (l) l.style.display = 'none'
        }
      })
    )

    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: .12 }
    )
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))

    const cio = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          const end = +el.dataset.count!
          const suf = el.dataset.suffix || ''
          const st = performance.now()
          const tick = (n: number) => {
            const p = Math.min((n - st) / 1400, 1)
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * end).toLocaleString('uz-UZ') + suf
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          cio.unobserve(el)
        }
      }),
      { threshold: .5 }
    )
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el))

    document.querySelectorAll('.q-head').forEach(h =>
      h.addEventListener('click', () => (h.parentElement as HTMLElement)?.classList.toggle('open'))
    )
    document.querySelectorAll('.f-card').forEach(c =>
      c.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent
        const r = c.getBoundingClientRect()
        ;(c as HTMLElement).style.setProperty('--mx', (me.clientX - r.left) + 'px')
        ;(c as HTMLElement).style.setProperty('--my', (me.clientY - r.top) + 'px')
      })
    )

    document.getElementById('year')!.textContent = String(new Date().getFullYear())

    const sectionId = pathname === '/' ? null : pathname.replace('/', '')
    if (sectionId) {
      const el = document.getElementById(sectionId)
      if (el) {
        const start = scrollY
        const target = el.getBoundingClientRect().top + start - 20
        const dist = target - start
        const dur = 900
        const st = performance.now()
        const tick = (n: number) => {
          const p = Math.min((n - st) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          scrollTo(0, start + dist * ease)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }

    return () => {
      removeEventListener('scroll', scrollHandler)
      io.disconnect()
      cio.disconnect()
    }
  }, [pathname])

  return (
    <>
      <div className="bg-fx"><div className="blob b1"></div><div className="blob b2"></div><div className="blob b3"></div></div>
      <div className="grain"></div>

      <header className="nav" id="nav">
        <div className="nav-inner">
          <a href="/top" className="brand" style={{ gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', height: 55, overflow: 'hidden' }}>
              <img src="/Hisvex.png" alt="Hisvex" style={{ height: 110, width: 'auto', display: 'block', objectFit: 'cover', objectPosition: 'center' }} />
            </span>
            <span><span style={{ color: '#8B5CF6', fontSize: 28, fontWeight: 700 }}>His</span><span style={{ color: '#FFF', fontSize: 28, fontWeight: 700 }}>vex</span></span>
          </a>
          <nav className="nav-links">
            <a href="/imkoniyatlar">Imkoniyatlar</a><a href="/ekranlar">Ekranlar</a><a href="/narxlar">Narxlar</a><a href="/privacy">Privacy</a><a href="/faq">Savollar</a>
          </nav>
          <div className="nav-cta">
            <a href="/privacy" className="btn btn-ghost">Privacy</a>
            <a href="https://t.me/dilbek7011" target="_blank" className="btn btn-gold">Boshlash <span className="arr">→</span></a>
          </div>
          <div className="burger" id="burger"><span></span><span></span><span></span></div>
        </div>
      </header>

      <span id="top"></span>

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow reveal"><span className="dot"></span>Bar, kafe va do'konlar uchun #1 hisob-kitob</span>
            <h1 className="display reveal d1">Hisob-kitob <span className="it">mukammalligi</span> — cho'ntagingizda.</h1>
            <p className="lead reveal d2">Hisvex — mahsulot, ombor, savdo, qarzdor va statistikani <b style={{ color: 'var(--text)' }}>bitta ilovada</b> boshqaradi. Internetsiz ham ishlaydi, har bir so'm aniq hisoblanadi — hech qanday anglashilmovchiliksiz.</p>
            <div className="hero-cta reveal d3">
              <a href="https://t.me/dilbek7011" target="_blank" className="btn btn-gold">Hoziroq boshlash <span className="arr">→</span></a>
              <a href="/ekranlar" className="btn btn-ghost">Ilovani ko'rish</a>
            </div>
            <div className="hero-stats reveal d4">
              <div className="hstat"><div className="n" data-count="1200" data-suffix="+">0</div><div className="l">Savdo nuqtasi</div></div>
              <div className="hstat"><div className="n" data-count="99" data-suffix="%">0</div><div className="l">Hisob aniqligi</div></div>
              <div className="hstat"><div className="n">24<span className="u">/</span>7</div><div className="l">Offline rejim</div></div>
            </div>
          </div>
          <div className="hero-visual reveal d3">
            <div className="phone-back"></div>
            <div className="hero-badge hb1"><span className="ic" style={{ background: 'rgba(52,211,153,.15)' }}><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div>Kunlik foyda<small>+18% bugun</small></div></div>
            <div className="hero-badge hb2"><span className="ic" style={{ background: 'rgba(230,192,121,.15)' }}><svg viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#E6C079" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div>Bugungi tushum<small>4 250 000 so'm</small></div></div>
            <div className="phone float"><div className="notch"></div><div className="screen"><AppPhone idx={0} /></div></div>
          </div>
        </div>
        <div className="marquee"><div className="marquee-track">
          <span>Mahsulotlar</span><span>Kunlik ombor</span><span>Tezkor savdo</span><span>Qarzdorlar</span><span>Statistika &amp; Reyting</span><span>Offline sync</span><span>Blok kod himoyasi</span>
          <span>Mahsulotlar</span><span>Kunlik ombor</span><span>Tezkor savdo</span><span>Qarzdorlar</span><span>Statistika &amp; Reyting</span><span>Offline sync</span><span>Blok kod himoyasi</span>
        </div></div>
      </section>

      <section className="sec" id="imkoniyatlar">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow"><span className="dot"></span>Imkoniyatlar</span>
            <h2 className="section-title">Biznesingizni boshqarish uchun <span className="grad-text">hamma narsa</span></h2>
            <p className="lead">Bir nechta dasturni almashtiradigan, kassir uchun maxsus o'ylangan, oddiy va kuchli vositalar.</p>
          </div>
          <div className="bento">
            <div className="f-card span3 feature-big reveal d1"><div>
              <div className="f-ic"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" /></svg></div>
              <h3>Mahsulotlar boshqaruvi</h3><p>Rasm, narx, qoldiq va barcode bilan cheksiz mahsulot. Bir tegishda tahrirlash va qayta to'ldirish.</p>
            </div><div className="big-metric">∞ <span className="g">mahsulot</span></div></div>
            <div className="f-card span3 reveal d2"><div className="f-ic gold"><svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 14l3-4 3 3 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div><h3>Statistika &amp; Reyting</h3><p>Kunlik tushum, sof foyda, marja va eng ko'p sotilgan mahsulotlar — kun, oy va yil kesimida.</p></div>
            <div className="f-card span2 reveal d1"><div className="f-ic"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div><h3>Kunlik ombor</h3><p>Boshlang'ich qoldiqni belgilang — sotilgan miqdor avtomatik hisoblanadi.</p></div>
            <div className="f-card span2 reveal d2"><div className="f-ic"><svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="20" r="1.6" fill="currentColor" /><circle cx="18" cy="20" r="1.6" fill="currentColor" /><path d="M2 3h3l2.5 13h11l2-9H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div><h3>Tezkor savdo</h3><p>Savatga qo'shing, barcode skaner qiling va bir tegishda soting.</p></div>
            <div className="f-card span2 reveal d3"><div className="f-ic gold"><svg viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div><h3>Qarzdorlar</h3><p>Kim, qancha qarz — to'liq tarix bilan. Qo'shish va yopishni kuzating.</p></div>
            <div className="f-card span3 reveal d1"><div className="f-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 5v7a9 9 0 1 1-9-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div><h3>Offline-first &amp; Sync</h3><p>Internet yo'qmi? Ilova lokal ishlaydi va aloqa tiklanganda serverga avtomatik sinxronlanadi.</p></div>
            <div className="f-card span3 reveal d2"><div className="f-ic gold"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div><h3>Biznes kun (00:00 emas)</h3><p>Tungacha ishlaydigan barlar uchun: hisobot kunini o'zingiz belgilaysiz. Tungi savdo to'g'ri kunga yoziladi.</p></div>
          </div>
        </div>
      </section>

      <section className="sec" id="ekranlar">
        <div className="wrap">
          <div className="sec-head reveal" style={{ maxWidth: 720 }}>
            <span className="eyebrow"><span className="dot"></span>Ilova ichidan</span>
            <h2 className="section-title">Soddalik — bu <span className="it" style={{ fontStyle: 'italic', color: 'var(--gold)' }}>eng yuqori kuch</span></h2>
            <p className="lead">Pastdagi menyuga bosib, barcha ekranlarni real ilovadagidek ko'ring.</p>
          </div>
          <div className="showcase">
            <div className="hero-visual reveal d1" style={{ minHeight: 600, flexDirection: 'column' }}>
              <div className="phone tilt"><div className="notch"></div><div className="screen"><AppPhone idx={1} /></div></div>
              <div className="tap-hint"><span className="k">☞</span> Pastdagi menyuga bosing</div>
            </div>
            <div className="show-list">
              <div className="show-item reveal d1"><span className="n">01</span><div><h4>Real vaqtdagi hisob</h4><p>Har bir savdo tushum va foydani darhol yangilaydi. Kun yakunida qo'lda sanash shart emas.</p></div></div>
              <div className="show-item reveal d2"><span className="n">02</span><div><h4>Mahsulotlar reytingi</h4><p>Qaysi mahsulot ko'p daromad keltiryapti? Reyting buni aniq ko'rsatadi.</p></div></div>
              <div className="show-item reveal d3"><span className="n">03</span><div><h4>Davr bo'yicha tahlil</h4><p>Kun, oy va yil kesimida dinamikani kuzating.</p></div></div>
              <div className="show-item reveal d4"><span className="n">04</span><div><h4>Eksport (CSV)</h4><p>Hisobotlarni yuklab oling yoki ulashing. Telegramga avtomatik kunlik hisobot keladi.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow"><span className="dot"></span>Qanday ishlaydi</span><h2 className="section-title">4 qadamda ishga tushing</h2></div>
          <div className="steps">
            <div className="step reveal d1"><div className="num"></div><h4>Ro'yxatdan o'ting</h4><p>Telefon raqamingiz bilan bir daqiqada hisob yarating.</p></div>
            <div className="step reveal d2"><div className="num"></div><h4>Mahsulot qo'shing</h4><p>Nomi, narxi va qoldig'ini kiriting — yoki barcode skaner qiling.</p></div>
            <div className="step reveal d3"><div className="num"></div><h4>Soting</h4><p>Har bir savdoni bir tegishda qayd eting. Qoldiq avtomatik kamayadi.</p></div>
            <div className="step reveal d4"><div className="num"></div><h4>Hisobotni ko'ring</h4><p>Tushum, foyda va reytingni real vaqtda kuzating.</p></div>
          </div>
        </div>
      </section>

      <section className="sec" id="narxlar">
        <div className="wrap">
          <div className="sec-head reveal" style={{ textAlign: 'center', margin: '0 auto 54px' as any }}><span className="eyebrow"><span className="dot"></span>Tariflar</span><h2 className="section-title">Biznesingizga mos <span className="grad-text">tarif</span></h2><p className="lead" style={{ margin: '14px auto 0' }}>Kichik do'kondan kattagacha — har bir bosqich uchun.</p></div>
          <div className="prices">
            <div className="price reveal d1">
              <div className="pname">Tekin</div><div className="pdesc">Boshlab ko'rish va kichik nuqtalar uchun.</div><div className="pcost">0 <small>so'm</small></div>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Mahsulot va ombor</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Kunlik savdo</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Offline rejim</li>
                <li className="off"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>Statistika &amp; Reyting</li>
              </ul>
              <a href="https://t.me/dilbek7011" target="_blank" className="btn btn-ghost">Boshlash</a>
            </div>
            <div className="price reveal d2">
              <div className="pname">Bor</div><div className="pdesc">O'sib borayotgan do'konlar uchun.</div><div className="pcost">44 000 <small>so'm/oy</small></div>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>100 ta mahsulotgacha</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Savdo va qarzdorlar</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Offline sync</li>
                <li className="off"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>Cheksiz miqyos</li>
              </ul>
              <a href="https://t.me/dilbek7011" target="_blank" className="btn btn-ghost">Tanlash</a>
            </div>
            <div className="price feat reveal d3">
              <span className="tag">Ommabop</span><div className="pname">Pro</div><div className="pdesc">To'liq imkoniyatlar, cheksiz miqyos.</div><div className="pcost">99 000 <small>so'm/oy</small></div>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><b>Cheksiz</b> mahsulot</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>To'liq Statistika &amp; Reyting</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Telegram hisobotlari</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Ustuvor qo'llab-quvvatlash</li>
              </ul>
              <a href="https://t.me/dilbek7011" target="_blank" className="btn btn-gold">Pro olish <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="privacy">
        <div className="wrap">
          <div className="sec-shield reveal">
            <div>
              <span className="eyebrow"><span className="dot"></span>Privacy</span>
              <h2 className="section-title" style={{ margin: '18px 0 14px', fontSize: 'clamp(28px,3.5vw,42px)' }}>Ma'lumotlaringiz <span className="grad-text">maxfiy</span></h2>
              <p className="lead" style={{ marginBottom: 30 }}>Hisvex mijoz ma'lumotlarini uchinchi tomonga uzatmaydi. Barcha yozuvlar faqat sizning qurilmangiz va hisobingizda.</p>
              <div className="shield-list">
                <div className="shield-item"><span className="ic"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 6v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span><div><h4>Ma'lumot sizniki</h4><p>Savdo, mahsulot va mijoz ma'lumotlari faqat sizga tegishli — biz ulardan foydalanmaymiz.</p></div></div>
                <div className="shield-item"><span className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg></span><div><h4>Shifrlangan saqlash</h4><p>Barcha ma'lumotlar shifrlangan holda saqlanadi va uzatiladi.</p></div></div>
                <div className="shield-item"><span className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M21 4v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div><h4>Nazorat sizda</h4><p>Istalgan vaqtda ma'lumotlarni eksport qilish yoki hisobni o'chirish mumkin.</p></div></div>
              </div>
            </div>
            <div className="shield-visual"><div className="shield-ring"><div className="shield-core"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div></div>
          </div>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap">
          <div className="sec-head reveal" style={{ textAlign: 'center', margin: '0 auto 50px' as any }}><span className="eyebrow"><span className="dot"></span>Savol-javob</span><h2 className="section-title">Tez-tez beriladigan savollar</h2></div>
          <div className="faq">
            <div className="q reveal"><div className="q-head">Internet bo'lmasa ishlaydimi?<span className="pm">+</span></div><div className="q-body"><p>Ha. Hisvex offline-first ishlaydi — barcha mahsulot, savdo va ombor lokal saqlanadi. Internet tiklanganda avtomatik sinxronlanadi.</p></div></div>
            <div className="q reveal"><div className="q-head">Ma'lumotlarim yo'qolib qoladimi?<span className="pm">+</span></div><div className="q-body"><p>Yo'q. Ma'lumotlar ham qurilmada, ham serverda saqlanadi. Telefon almashtirsangiz ham hisobingizga kirib, hammasini qaytarib olasiz.</p></div></div>
            <div className="q reveal"><div className="q-head">Bir nechta qurilmada ishlata olamanmi?<span className="pm">+</span></div><div className="q-body"><p>Ha. Bitta hisob bilan bir nechta qurilmada sinxronlangan holda ishlashingiz mumkin.</p></div></div>
            <div className="q reveal"><div className="q-head">Hisob-kitob qanchalik aniq?<span className="pm">+</span></div><div className="q-body"><p>Har bir sotilgan dona, narx va foyda bitta mantiq bo'yicha hisoblanadi — telefon va serverda bir xil natija. Anglashilmovchilik bo'lmaydi.</p></div></div>
            <div className="q reveal"><div className="q-head">Qanday to'lov qilaman?<span className="pm">+</span></div><div className="q-body"><p>Tarif va to'lov uchun Telegram orqali bog'laning: <a href="https://t.me/dilbek7011" target="_blank" style={{ color: 'var(--gold)' }}>@dilbek7011</a>.</p></div></div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="cta-wrap reveal"><div className="cta-glow"></div>
            <span className="eyebrow"><span className="dot"></span>Bugun boshlang</span>
            <h2 style={{ marginTop: 18 }}>Biznesingiz <span className="it" style={{ fontStyle: 'italic', color: 'var(--gold)' }}>aniq raqamlarni</span> kutmoqda</h2>
            <p className="lead">Hisvex bilan har bir so'mni nazoratga oling. Bugun o'rnating — ertaga farqini ko'ring.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/dilbek7011" target="_blank" className="btn btn-gold">Hoziroq boshlash <span className="arr">→</span></a>
              <a href="/imkoniyatlar" className="btn btn-ghost">Imkoniyatlarni ko'rish</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <a href="/top" className="brand" style={{ gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', height: 55, overflow: 'hidden' }}>
                  <img src="/Hisvex.png" alt="Hisvex" style={{ height: 110, width: 'auto', display: 'block', objectFit: 'cover', objectPosition: 'center' }} />
                </span>
                <span><span style={{ color: '#8B5CF6', fontSize: 28, fontWeight: 700 }}>His</span><span style={{ color: '#FFF', fontSize: 28, fontWeight: 700 }}>vex</span></span>
              </a>
              <p>Bar, kafe va do'konlar uchun premium hisob-kitob ilovasi. Oddiy, tez va ishonchli.</p>
              <a href="https://t.me/dilbek7011" target="_blank" className="tg-btn"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 3 2 10.5l5.5 2L17 6l-7 8.5V20l3-3.5 4 3z" /></svg>@dilbek7011</a>
            </div>
            <div className="foot-col"><h5>Mahsulot</h5><a href="/imkoniyatlar">Imkoniyatlar</a><a href="/ekranlar">Ekranlar</a><a href="/narxlar">Narxlar</a><a href="/privacy">Privacy</a></div>
            <div className="foot-col"><h5>Kompaniya</h5><a href="/faq">Savol-javob</a><a href="https://t.me/dilbek7011" target="_blank">Bog'lanish</a><a href="/top">Boshiga</a></div>
            <div className="foot-col"><h5>Huquqiy</h5><a href="/terms">Foydalanish shartlari</a><a href="/privacy">Maxfiylik siyosati</a></div>
          </div>
          <div className="foot-bot">
            <span>© <span id="year"></span> Hisvex. Barcha huquqlar himoyalangan.</span>
            <span>O'zbekistonda 🇺🇿 ishlab chiqilgan</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
