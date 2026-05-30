import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function PrivacyPage() {
  useEffect(() => {
    document.getElementById('y')!.textContent = String(new Date().getFullYear())
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (a) {
        e.preventDefault()
        const el = document.getElementById(a.getAttribute('href')!.slice(1))
        if (el) {
          const start = scrollY
          const target = el.getBoundingClientRect().top + start - 20
          const dist = target - start
          const dur = 600
          const st = performance.now()
          const tick = (n: number) => {
            const p = Math.min((n - st) / dur, 1)
            scrollTo(0, start + dist * (1 - Math.pow(1 - p, 3)))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      <div className="bg"><span></span><span></span></div>

      <header>
        <div className="nav">
          <Link to="/" className="brand"><span className="logo"><svg viewBox="0 0 24 24" fill="none"><path d="M4 18V8m5 10V5m5 13v-7m5 7V9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg></span>His<b>vex</b></Link>
          <Link to="/" className="back">← Bosh sahifa</Link>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">Huquqiy</span>
          <h1>Maxfiylik siyosati</h1>
          <p className="upd">Oxirgi yangilanish: 2026-yil 30-may</p>
        </div>
      </section>

      <section className="content">
        <div className="wrap">
          <div className="callout"><p>Sizning ishonchingiz biz uchun muhim. Ushbu siyosat Hisvex qanday ma'lumot yig'ishi, saqlashi va himoya qilishini tushuntiradi.</p></div>

          <div className="toc">
            <h4>Mundarija</h4>
            <a href="#p1">1. Qanday ma'lumot yig'amiz</a>
            <a href="#p2">2. Ma'lumotdan qanday foydalanamiz</a>
            <a href="#p3">3. Ma'lumot saqlash va xavfsizlik</a>
            <a href="#p4">4. Ma'lumotlarni ulashish</a>
            <a href="#p5">5. Sizning huquqlaringiz</a>
            <a href="#p6">6. Bolalar maxfiyligi</a>
            <a href="#p7">7. O'zgartirishlar va bog'lanish</a>
          </div>

          <h2 id="p1"><span className="n">01</span>Qanday ma'lumot yig'amiz</h2>
          <div className="cards">
            <div className="dcard"><h4><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Hisob ma'lumotlari</h4><p>Foydalanuvchi nomi, telefon raqami va parol (shifrlangan holda).</p></div>
            <div className="dcard"><h4><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Biznes ma'lumotlari</h4><p>Mahsulotlar, narxlar, ombor, sotuvlar, qarzdorlar va hisobotlar.</p></div>
            <div className="dcard"><h4><svg viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Qurilma ma'lumotlari</h4><p>Qurilma identifikatori — sinxronlash va xavfsizlik uchun.</p></div>
            <div className="dcard"><h4><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Texnik ma'lumotlar</h4><p>Sinxronlash vaqti va asosiy texnik loglar — ilova barqarorligi uchun.</p></div>
          </div>
          <p>Biz <strong>hech qachon</strong> bank kartasi raqamlari yoki keraksiz shaxsiy ma'lumotlarni so'ramaymiz.</p>

          <h2 id="p2"><span className="n">02</span>Ma'lumotdan qanday foydalanamiz</h2>
          <ul>
            <li>Ilovaning asosiy vazifalarini ta'minlash: hisob-kitob, sotuv, ombor va statistika.</li>
            <li>Qurilmalar o'rtasida ma'lumotlarni sinxronlash.</li>
            <li>Hisobingiz xavfsizligini ta'minlash va firibgarlikni oldini olish.</li>
            <li>Qo'llab-quvvatlash xizmatini ko'rsatish va ilovani yaxshilash.</li>
            <li>Sizning roziligingiz bilan Telegram orqali kunlik hisobotlar yuborish.</li>
          </ul>

          <h2 id="p3"><span className="n">03</span>Ma'lumot saqlash va xavfsizlik</h2>
          <ul>
            <li>Ma'lumotlar qurilmangizda <strong>lokal</strong> va himoyalangan <strong>serverda</strong> saqlanadi.</li>
            <li>Parollar <strong>shifrlangan</strong> (bcrypt) holatda saqlanadi — hech kim, jumladan biz ham, ochiq ko'rmaymiz.</li>
            <li>Kirish <strong>JWT token</strong> orqali himoyalanadi.</li>
            <li>Mahsulot tahririni himoyalash uchun ixtiyoriy <strong>blok kod</strong> mavjud.</li>
            <li>Ma'lumotlar siz hisobdan foydalanib turgan davrda saqlanadi.</li>
          </ul>

          <h2 id="p4"><span className="n">04</span>Ma'lumotlarni ulashish</h2>
          <p>Biz sizning ma'lumotlaringizni <strong>uchinchi shaxslarga sotmaymiz</strong> va reklama maqsadida ulashmaymiz. Ma'lumot faqat quyidagi hollarda oshkor qilinishi mumkin:</p>
          <ul>
            <li>Qonun talab qilgan hollarda yoki davlat organlarining qonuniy so'rovi bo'yicha.</li>
            <li>Ilovaning ishlashini ta'minlovchi xizmatlar (server hosting) doirasida — qat'iy maxfiylik asosida.</li>
          </ul>

          <h2 id="p5"><span className="n">05</span>Sizning huquqlaringiz</h2>
          <ul>
            <li>O'z ma'lumotlaringizga kirish va ularni tahrirlash.</li>
            <li>Hisobingizni va unga bog'liq ma'lumotlarni o'chirishni so'rash.</li>
            <li>Telegram hisobotlaridan voz kechish.</li>
            <li>Maxfiylik bo'yicha har qanday savol bilan biz bilan bog'lanish.</li>
          </ul>

          <h2 id="p6"><span className="n">06</span>Bolalar maxfiyligi</h2>
          <p>Ilova biznes egalari va kassirlar uchun mo'ljallangan. Biz ataylab 18 yoshdan kichik shaxslardan ma'lumot yig'maymiz.</p>

          <h2 id="p7"><span className="n">07</span>O'zgartirishlar va bog'lanish</h2>
          <p>Ushbu siyosat vaqti-vaqti bilan yangilanishi mumkin. Muhim o'zgarishlar haqida xabar beramiz. Maxfiylik bo'yicha savollar uchun: Telegram <a href="https://t.me/dilbek7011" target="_blank">@dilbek7011</a>.</p>

          <div className="callout"><p>Ushbu hujjat <Link to="/terms">Foydalanish shartlari</Link> bilan birgalikda amal qiladi.</p></div>
        </div>
      </section>

      <footer>
        <div className="wrap">© <span id="y"></span> Hisvex · <Link to="/">Bosh sahifa</Link> · <Link to="/terms">Foydalanish shartlari</Link></div>
      </footer>
    </>
  )
}

export default PrivacyPage
