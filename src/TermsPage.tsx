import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function TermsPage() {
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
    <div className="terms">
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
          <h1>Foydalanish shartlari</h1>
          <p className="upd">Oxirgi yangilanish: 2026-yil 30-may</p>
        </div>
      </section>

      <section className="content">
        <div className="wrap">
          <div className="toc">
            <h4>Mundarija</h4>
            <a href="#s1">1. Umumiy qoidalar</a>
            <a href="#s2">2. Hisob va ro'yxatdan o'tish</a>
            <a href="#s3">3. Foydalanish qoidalari</a>
            <a href="#s4">4. Tariflar va to'lov</a>
            <a href="#s5">5. Ma'lumotlar va mas'uliyat</a>
            <a href="#s6">6. Cheklovlar va to'xtatish</a>
            <a href="#s7">7. O'zgartirishlar</a>
            <a href="#s8">8. Bog'lanish</a>
          </div>

          <div className="callout"><p>Hisvex ilovasini yuklab olib yoki undan foydalanib, siz ushbu Foydalanish shartlariga rozilik bildirgan hisoblanasiz. Iltimos, ularni diqqat bilan o'qing.</p></div>

          <h2 id="s1"><span className="n">01</span>Umumiy qoidalar</h2>
          <p>Hisvex (keyingi o'rinlarda — "Ilova") bar, kafe, do'kon va savdo nuqtalari uchun mahsulot, ombor, sotuv, qarzdorlar va statistikani yuritishga mo'ljallangan hisob-kitob dasturidir. Ushbu shartlar Ilova va foydalanuvchi o'rtasidagi munosabatlarni tartibga soladi.</p>
          <p>Ilovadan foydalanish uchun siz kamida 18 yoshda bo'lishingiz yoki qonuniy vakilingiz roziligiga ega bo'lishingiz kerak.</p>

          <h2 id="s2"><span className="n">02</span>Hisob va ro'yxatdan o'tish</h2>
          <ul>
            <li>Ro'yxatdan o'tishda haqiqiy va to'g'ri ma'lumot (foydalanuvchi nomi, telefon raqami) kiritishingiz shart.</li>
            <li>Hisob ma'lumotlari va parolingiz maxfiyligini saqlash sizning zimmangizda.</li>
            <li>Hisobingiz orqali amalga oshirilgan barcha harakatlar uchun siz javobgarsiz.</li>
            <li>Ruxsatsiz kirishni sezsangiz, darhol administratorga xabar bering.</li>
          </ul>

          <h2 id="s3"><span className="n">03</span>Foydalanish qoidalari</h2>
          <p>Ilovadan qonuniy maqsadlarda foydalanasiz. Quyidagilar taqiqlanadi:</p>
          <ul>
            <li>Ilovaga zarar yetkazish, buzish yoki ruxsatsiz kirish urinishlari.</li>
            <li>Boshqa foydalanuvchilarning ma'lumotlariga noqonuniy kirish.</li>
            <li>Ilovani firibgarlik yoki noqonuniy faoliyat uchun ishlatish.</li>
            <li>Ilova kodini nusxalash, qayta sotish yoki teskari muhandislik qilish.</li>
          </ul>

          <h2 id="s4"><span className="n">04</span>Tariflar va to'lov</h2>
          <ul>
            <li>Ilova <strong>Tekin</strong>, <strong>Bor</strong> va <strong>Pro</strong> tariflarini taklif qiladi.</li>
            <li>Pullik tariflarning narxi va to'lov shartlari administrator orqali kelishiladi.</li>
            <li>Obuna muddati tugagach, ba'zi imkoniyatlar (masalan, Statistika va Reyting) cheklanishi mumkin.</li>
            <li>To'lovlar, agar qonunda boshqacha belgilanmagan bo'lsa, qaytarilmaydi.</li>
          </ul>

          <h2 id="s5"><span className="n">05</span>Ma'lumotlar va mas'uliyat</h2>
          <p>Ilova ma'lumotlaringizni qurilmangizda lokal va serverda saqlaydi hamda sinxronlaydi. Biz ma'lumotlar xavfsizligi uchun barcha asosli choralarni ko'ramiz.</p>
          <p>Shu bilan birga, Ilova "qanday bo'lsa shundayligicha" taqdim etiladi. Biz quyidagilar uchun javobgar emasmiz:</p>
          <ul>
            <li>Foydalanuvchi tomonidan noto'g'ri kiritilgan ma'lumotlar oqibatida yuzaga kelgan xatoliklar.</li>
            <li>Qurilmaning buzilishi, yo'qolishi yoki internet uzilishi natijasidagi nosozliklar.</li>
            <li>Foydalanuvchining shartlarni buzishi natijasidagi zararlar.</li>
          </ul>

          <h2 id="s6"><span className="n">06</span>Cheklovlar va to'xtatish</h2>
          <p>Ushbu shartlar buzilgan taqdirda biz hisobingizni vaqtincha yoki butunlay cheklash huquqini saqlab qolamiz. Siz istalgan vaqtda hisobingizdan foydalanishni to'xtatishingiz mumkin.</p>

          <h2 id="s7"><span className="n">07</span>O'zgartirishlar</h2>
          <p>Biz ushbu shartlarni vaqti-vaqti bilan yangilashimiz mumkin. Muhim o'zgarishlar haqida Ilova yoki Telegram orqali xabar beriladi. Yangilanishdan keyin Ilovadan foydalanishda davom etish — yangi shartlarga rozilik hisoblanadi.</p>

          <h2 id="s8"><span className="n">08</span>Bog'lanish</h2>
          <p>Savollar yoki murojaatlar uchun: Telegram <a href="https://t.me/dilbek7011" target="_blank">@dilbek7011</a>.</p>

          <div className="callout"><p>Ushbu hujjat <Link to="/privacy">Maxfiylik siyosati</Link> bilan birgalikda amal qiladi.</p></div>
        </div>
      </section>

      <footer>
        <div className="wrap">© <span id="y"></span> Hisvex · <Link to="/">Bosh sahifa</Link> · <Link to="/privacy">Maxfiylik siyosati</Link></div>
      </footer>
    </div>
  )
}

export default TermsPage
