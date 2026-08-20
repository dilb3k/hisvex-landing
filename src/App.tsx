import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Linux build only, unchanged since v1.0.3 — its link stays on GH below.
const GH = "https://github.com/dilb3k/hisvex-landing/releases/download/v1.0.3";
// macOS + Windows, both rebuilt together for this release. The in-app update
// checker (UpdateAvailableModal.tsx) compares its own platform's running
// version against `releases/latest`'s tag_name — so whichever tag is newest
// here must actually contain that platform's asset, or an install can never
// see itself as outdated and never prompts to update. Bump this (and its
// referenced filenames below) together whenever mac/Windows are rebuilt;
// Linux keeps pointing at GH above until it's rebuilt too.
const GH2 = "https://github.com/dilb3k/hisvex-landing/releases/download/v1.0.6";

// Android/mobile has no GitHub-releases equivalent to check against (unlike
// desktop above), so the in-app update prompt (media-project-mobile's
// UpdateAvailableModal.tsx) instead reads MOBILE_LATEST_VERSION /
// MOBILE_DOWNLOAD_URL from the backend (comp-bar-server/backend/src/config/env.ts).
// These two constants are what a human sees on this page, and they are NOT
// wired to that backend value — bumping a mobile release means updating
// THREE places by hand, or this page silently shows a stale version/link
// while the app itself is already prompting users to update to a newer one:
//   1. media-project-mobile/app.json + package.json "version"
//   2. MOBILE_LATEST_VERSION / MOBILE_DOWNLOAD_URL env vars on the backend host
//   3. MOBILE_APK_VERSION / MOBILE_APK_URL right here
const MOBILE_APK_VERSION = "1.0.1";
const MOBILE_APK_URL =
  "https://expo.dev/accounts/hisvex/projects/hisvex/builds/e9188422-b986-4702-bd6b-5ea5eeea36d0";

const getMacDmg = () => {
  const u = navigator.userAgent;
  if (u.includes("Apple Silicon") || u.includes("arm64"))
    return `${GH2}/Hisvex-1.0.6-arm64.dmg`;
  return `${GH2}/Hisvex-1.0.6-x64.dmg`;
};

const getDesktopDownload = () => {
  const u = navigator.userAgent.toLowerCase();
  if (u.includes("mac"))
    return { href: getMacDmg(), label: "macOS DMG", file: "Hisvex-mac.dmg" };
  if (u.includes("linux"))
    return {
      href: `${GH}/Hisvex-1.0.3.AppImage`,
      label: "Linux AppImage",
      file: "Hisvex.AppImage",
    };
  return {
    href: `${GH2}/Hisvex-Setup-1.0.6.exe`,
    label: "Windows",
    file: "Hisvex-Setup-1.0.6.exe",
  };
};

function ArrowIcon() {
  return (
    <svg
      className="arr"
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: 16, height: 16, flexShrink: 0 }}
    >
      <path
        d="M5 12h13.5M13.5 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DownloadArrowIcon() {
  return (
    <svg
      className="arr"
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: 16, height: 16, flexShrink: 0 }}
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  scan: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

const pc = (
  e: string,
  n: string,
  i: number,
  q: number,
  k: string,
  so: string,
) =>
  '<div class="pc"><div class="pc-main"><div class="p-thumb">' +
  e +
  '</div><div class="pc-info"><div class="pc-name">' +
  n +
  '</div><div class="pc-sub">#' +
  i +
  " · Joriy qoldiq: " +
  q +
  '</div><div class="pc-stat"><i></i>Mavjud</div></div><div class="pc-prices"><div class="pc-pr"><div class="v">' +
  k +
  '</div><div class="l">Kelish</div></div><div class="pc-pr"><div class="v">' +
  so +
  '</div><div class="l">Sotish</div></div></div></div><div class="pc-act"><div class="e">' +
  I.edit +
  'Tahrirlash</div><div class="a">' +
  I.add +
  "Qo'shish</div></div></div>";

const omc = (
  e: string,
  n: string,
  i: number,
  p: string,
  bd: string,
  b: number,
  q: number,
  s: number,
  extra = "",
) => {
  const col =
    bd === "Bor" ? "var(--emerald)" : bd === "Kam" ? "#F59E0B" : "var(--rose)";
  return (
    '<div class="inv-card"><div class="inv-top"><div class="p-thumb" style="width:36px;height:36px;font-size:16px">' +
    e +
    '</div><div class="pc-info"><div class="pc-name">#' +
    i +
    " " +
    n +
    '</div><div class="pc-sub">' +
    p +
    ' so\'m</div></div><span class="inv-badge" style="background:' +
    col +
    "28;color:" +
    col +
    '"><i style="background:' +
    col +
    '"></i>' +
    bd +
    '</span></div><div class="inv-q"><div class="qi"><div class="l">Boshlang\'ich</div><div class="v">' +
    b +
    '</div></div><div class="sep"></div><div class="qi"><div class="l">Qoldiq</div><div class="v">' +
    q +
    '</div></div><div class="sep"></div><div class="qi"><div class="l">Sotilgan</div><div class="v" style="color:var(--emerald)">' +
    s +
    "</div></div></div>" +
    extra +
    "</div>"
  );
};

const sale = (e: string, n: string, p: number, q: number, c: number) => {
  const tot =
    c > 0
      ? '<div class="sale-tot">' +
        (c * p).toLocaleString("uz-UZ") +
        " so'm</div>"
      : "";
  return (
    '<div class="sale-row' +
    (c > 0 ? " sel" : "") +
    '"><div class="sale-main"><div class="p-thumb" style="width:36px;height:36px;font-size:16px">' +
    e +
    '</div><div class="pc-info"><div class="pc-name">' +
    n +
    '</div><div class="pc-sub">' +
    p.toLocaleString("uz-UZ") +
    " so'm · Qoldiq: " +
    q +
    '</div></div><div class="stepper"><b>−</b><span class="qn">' +
    c +
    "</span><b>+</b></div></div>" +
    tot +
    "</div>"
  );
};

const deb = (l: string, n: string, ph: string, a: string, g: string) =>
  '<div class="deb-card"><div class="deb-av" style="background:' +
  g +
  '">' +
  l +
  '</div><div class="deb-info"><div class="deb-name">' +
  n +
  '</div><div class="deb-phone">' +
  ph +
  '</div></div><div class="deb-amt">' +
  a +
  '<br><span style="font-size:9px;color:var(--faint);font-weight:600">so\'m</span></div></div>';

const omDetail =
  '<div class="inv-det"><div class="c"><div class="l">Tushum</div><div class="v">60 000</div></div><div class="c"><div class="l">Qoldiq qiymati</div><div class="v">576 000</div></div><div class="c"><div class="l">Birlik foyda</div><div class="v g">2 200</div></div></div>';

const screens = [
  '<div class="appscreen active"><div class="scr-title">Mahsulotlar</div><div class="scr-head" style="padding-top:0"><div class="scr-search">' +
    I.s +
    'Qidirish...</div><div class="scr-ic lock">' +
    I.lock +
    '</div><div class="scr-ic add">' +
    I.add +
    '</div></div><div class="scr-body">' +
    pc("🍫", "snikers", 1, 48, "9 800", "12 000") +
    pc("🍟", "lays", 2, 113, "9 000", "15 000") +
    pc("⚡", "flash", 3, 25, "9 800", "15 000") +
    "</div></div>",
  '<div class="appscreen"><div class="scr-title">Ombor</div><div class="om-date"><div class="d">‹  30 May 2026  ›</div><div class="w">Saturday</div></div><div class="scr-body"><div class="om-sum"><div class="c"><div class="l">Boshlang\'ich</div><div class="v">247</div></div><div class="c"><div class="l">Qoldiq</div><div class="v">228</div></div><div class="c"><div class="l">Sotilgan</div><div class="v g">19</div></div><div class="c"><div class="l">Foyda</div><div class="v g">87 000</div></div></div>' +
    omc("🍫", "snikers", 1, "12 000", "Bor", 53, 48, 5, omDetail) +
    omc("🍟", "lays", 2, "15 000", "Bor", 117, 113, 4) +
    "</div></div>",
  '<div class="appscreen"><div class="scr-head"><div class="scr-search">' +
    I.s +
    'Qidirish...</div></div><div style="padding:0 14px 8px;color:var(--faint);font-size:11px;font-weight:600">Bugungi kun uchun tez savdo</div><div class="scr-body">' +
    sale("🍫", "snikers", 12000, 48, 1) +
    sale("🍟", "lays", 15000, 113, 2) +
    sale("⚡", "flash", 15000, 25, 0) +
    sale("🥤", "gorilla", 15000, 18, 0) +
    '</div><div class="cart-bar"><div class="ct">Jami · 3 sotilgan</div><div class="cv">42 000 so\'m</div><div class="row"><div class="b1">Bekor</div><div class="scan">' +
    I.scan +
    '</div><div class="b2">Sotish</div></div></div></div>',
  '<div class="appscreen"><div class="scr-title">Statistika</div><div class="scr-body">' +
    '<div class="seg"><div class="s">Kun</div><div class="s on">Oy</div><div class="s">Yil</div></div>' +
    '<div class="stat-actions"><div class="ab"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Yuklab olish (CSV)</div><div class="ab"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Barcha vaqt</div></div>' +
    '<div class="stat-hero"><div class="l">Jami tushum</div><div class="big">13 277 000 so\'m</div><div class="row"><div class="c"><div class="l">Sotilgan dona</div><div class="v">954</div></div><div class="c"><div class="l">Sof foyda</div><div class="v g">4 441 470</div></div><div class="c"><div class="l">Marja</div><div class="v g">33%</div></div></div></div>' +
    '<div class="stat-grid"><div class="h">May 2026</div>' +
    '<div class="g2"><div class="c"><div class="l">Jami sotiladigan dona</div><div class="v">1182</div></div><div class="c"><div class="l">Sotilgan dona</div><div class="v">954</div></div></div>' +
    '<div class="g2" style="margin-top:9px"><div class="c"><div class="l">Jami sotish qiymati</div><div class="v">16 577 000</div></div><div class="c"><div class="l">Sotilgan qiymat</div><div class="v">13 277 000</div></div></div>' +
    '<div class="g2" style="margin-top:9px"><div class="c"><div class="l">Qolgan potensial foyda</div><div class="v g">5 568 670</div></div><div class="c"><div class="l">Olingan foyda</div><div class="v g">4 441 470</div></div></div>' +
    '<div class="g2" style="margin-top:9px"><div class="c"><div class="l">Qolgan dona</div><div class="v">228</div></div><div class="c"><div class="l">Qolgan qiymat</div><div class="v r">3 300 000</div></div></div>' +
    "</div>" +
    '<div class="rk"><div class="h">Top mahsulotlar reytingi</div>' +
    '<div class="rk-row"><span class="rk-n top">1</span><span class="rk-nm">lays</span><span class="rk-q">320 ta</span><span class="rk-p">+1.9M</span></div>' +
    '<div class="rk-row"><span class="rk-n top">2</span><span class="rk-nm">snikers</span><span class="rk-q">264 ta</span><span class="rk-p">+1.4M</span></div>' +
    '<div class="rk-row"><span class="rk-n top">3</span><span class="rk-nm">flash</span><span class="rk-q">198 ta</span><span class="rk-p">+0.9M</span></div>' +
    '<div class="rk-row"><span class="rk-n">4</span><span class="rk-nm">gorilla</span><span class="rk-q">112 ta</span><span class="rk-p">+0.6M</span></div>' +
    "</div>" +
    "</div></div>",
  '<div class="appscreen"><div class="scr-head"><div class="scr-search">' +
    I.s +
    'Qidirish...</div></div><div class="scr-title" style="padding-top:0">Qarzdorlar</div><div class="scr-body">' +
    deb(
      "A",
      "Akmal aka",
      "+998 90 123 45 67",
      "450 000",
      "linear-gradient(135deg,var(--violet),var(--violet-deep))",
    ) +
    deb(
      "D",
      "Dilshod",
      "+998 91 234 56 78",
      "280 000",
      "linear-gradient(135deg,#C99B4E,#E6C079)",
    ) +
    deb(
      "S",
      "Sardor",
      "+998 93 345 67 89",
      "120 000",
      "linear-gradient(135deg,#34D399,#059669)",
    ) +
    '</div><div class="deb-foot">+ Qarzdor qo\'shish</div></div>',
];

const tabsHtml =
  '<div class="scr-tabs">' +
  '<div class="tab on" data-tab="0">' +
  I.mah +
  "Mahsulotlar</div>" +
  '<div class="tab" data-tab="1">' +
  I.omb +
  "Ombor</div>" +
  '<div class="tab" data-tab="2">' +
  I.sav +
  "Savdo</div>" +
  '<div class="tab" data-tab="3">' +
  I.st +
  "Statistika</div>" +
  '<div class="tab" data-tab="4">' +
  I.qz +
  "Qarzdorlar</div></div>";

function AppPhone({ idx: pi }: { idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scr = ref.current;
    if (!scr) return;
    scr.innerHTML =
      '<div class="scr-status"><span>9:41</span><div class="dots"><i></i><i></i><i></i></div></div><div class="scr-screens">' +
      screens.join("") +
      "</div>" +
      tabsHtml;
    const tabs = scr.querySelectorAll<HTMLElement>(".tab");
    const scrs = scr.querySelectorAll<HTMLElement>(".appscreen");
    let auto = true;
    const go = (i: number) => {
      tabs.forEach((t) => t.classList.toggle("on", +t.dataset.tab! === i));
      scrs.forEach((s, si) => s.classList.toggle("active", si === i));
    };
    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        auto = false;
        go(+t.dataset.tab!);
      }),
    );
    let i = pi % 5;
    const timer = setInterval(
      () => {
        if (!auto) {
          clearInterval(timer);
          return;
        }
        i = (i + 1) % tabs.length;
        go(i);
      },
      2800 + pi * 500,
    );
    return () => clearInterval(timer);
  }, [pi]);
  return <div ref={ref} className="scr"></div>;
}

function App() {
  const { pathname } = useLocation();
  const [dur, setDur] = useState(1);
  const cleanupRefs = useRef<Array<() => void>>([]);

  useEffect(() => {
    cleanupRefs.current.forEach((fn) => fn());
    cleanupRefs.current = [];

    const nav = document.getElementById("nav");
    const scrollHandler = () => nav?.classList.toggle("scrolled", scrollY > 20);
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const burger = document.getElementById("burger");
    const burgerMenu = document.getElementById("burger-menu");
    const burgerHandler = () => {
      if (burgerMenu) {
        const isOpen = burgerMenu.style.display === "flex";
        burgerMenu.style.display = isOpen ? "none" : "flex";
        burger?.setAttribute("aria-expanded", String(!isOpen));
      }
    };
    burger?.addEventListener("click", burgerHandler);

    const linkCloseHandler = () => {
      if (burgerMenu) burgerMenu.style.display = "none";
      burger?.setAttribute("aria-expanded", "false");
    };
    const navLinks = document.querySelectorAll<HTMLElement>(
      ".nav-links a, #burger-menu a",
    );
    navLinks.forEach((a) => a.addEventListener("click", linkCloseHandler));

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const end = +(el.dataset.count ?? "0");
            const suf = el.dataset.suffix || "";
            const st = performance.now();
            const tick = (n: number) => {
              const p = Math.min((n - st) / 1400, 1);
              el.textContent =
                Math.floor((1 - Math.pow(1 - p, 3)) * end).toLocaleString(
                  "uz-UZ",
                ) + suf;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            cio.unobserve(el);
          }
        }),
      { threshold: 0.5 },
    );
    document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

    const qHandlers: Array<{ el: Element; fn: () => void }> = [];
    document.querySelectorAll(".q-head").forEach((h) => {
      const fn = () => {
        const opened = (h.parentElement as HTMLElement)?.classList.toggle(
          "open",
        );
        h.setAttribute("aria-expanded", String(!!opened));
      };
      h.addEventListener("click", fn);
      qHandlers.push({ el: h, fn });
    });

    const tiltCleanups: Array<() => void> = [];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduceMotion) {
      document.querySelectorAll<HTMLElement>(".tilt3d").forEach((el) => {
        const ax = +(el.dataset.tiltX ?? 8);
        const ay = +(el.dataset.tiltY ?? 12);
        // getBoundingClientRect() forces a synchronous layout, and mousemove
        // can fire well over 60x/sec — doing that plus two style writes on
        // every single event caused visible jank (worse on Windows, whose
        // Chromium builds don't absorb layout thrashing as gracefully as
        // macOS). Cache the rect per hover session and coalesce writes to
        // one per animation frame instead of one per raw event.
        let rect: DOMRect | null = null;
        let raf = 0;
        let pendingX = 0;
        let pendingY = 0;
        const apply = () => {
          raf = 0;
          if (!rect) return;
          const px = pendingX / rect.width - 0.5;
          const py = pendingY / rect.height - 0.5;
          el.style.setProperty("--rx", (py * -ax).toFixed(2) + "deg");
          el.style.setProperty("--ry", (px * ay).toFixed(2) + "deg");
        };
        const move = (e: Event) => {
          const me = e as MouseEvent;
          if (!rect) rect = el.getBoundingClientRect();
          pendingX = me.clientX - rect.left;
          pendingY = me.clientY - rect.top;
          if (!raf) raf = requestAnimationFrame(apply);
        };
        const leave = () => {
          rect = null;
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        tiltCleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
          if (raf) cancelAnimationFrame(raf);
        });
      });
    }

    const fCardCleanups: Array<() => void> = [];
    document.querySelectorAll(".f-card").forEach((c) => {
      const card = c as HTMLElement;
      let rect: DOMRect | null = null;
      let raf = 0;
      let pendingX = 0;
      let pendingY = 0;
      const apply = () => {
        raf = 0;
        card.style.setProperty("--mx", pendingX + "px");
        card.style.setProperty("--my", pendingY + "px");
      };
      const handler = (e: Event) => {
        const me = e as MouseEvent;
        if (!rect) rect = card.getBoundingClientRect();
        pendingX = me.clientX - rect.left;
        pendingY = me.clientY - rect.top;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      const leave = () => {
        rect = null;
      };
      card.addEventListener("mousemove", handler);
      card.addEventListener("mouseleave", leave);
      fCardCleanups.push(() => {
        card.removeEventListener("mousemove", handler);
        card.removeEventListener("mouseleave", leave);
        if (raf) cancelAnimationFrame(raf);
      });
    });

    document.getElementById("year")!.textContent = String(
      new Date().getFullYear(),
    );

    const sectionId = pathname === "/" ? null : pathname.replace("/", "");
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        const start = scrollY;
        const target = el.getBoundingClientRect().top + start - 20;
        const dist = target - start;
        const dur = 900;
        const st = performance.now();
        const tick = (n: number) => {
          const p = Math.min((n - st) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          scrollTo(0, start + dist * ease);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      burger?.removeEventListener("click", burgerHandler);
      navLinks.forEach((a) => a.removeEventListener("click", linkCloseHandler));
      io.disconnect();
      cio.disconnect();
      qHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      fCardCleanups.forEach((fn) => fn());
      tiltCleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return (
    <>
      <div className="bg-fx">
        <div className="blob-wrap b1"><div className="blob b1"></div></div>
        <div className="blob-wrap b2"><div className="blob b2"></div></div>
        <div className="blob-wrap b3"><div className="blob b3"></div></div>
      </div>
      <div className="grain"></div>

      <header className="nav" id="nav">
        <div className="nav-inner">
          <Link to="/top" className="brand" style={{ gap: 10 }}>
            <img
              src="/hisvex-logo-icon.png"
              alt="Hisvex"
              style={{
                width: 52,
                height: 52,
                objectFit: "contain",
                display: "block",
                marginRight: -12,
                paddingTop: 5,
              }}
            />
            <span>
              <span style={{ color: "#8B5CF6", fontSize: 28, fontWeight: 700 }}>
                is
              </span>
              <span style={{ color: "#FFF", fontSize: 28, fontWeight: 700 }}>
                vex
              </span>
            </span>
          </Link>
          <nav className="nav-links">
            <Link to="/imkoniyatlar">Imkoniyatlar</Link>
            <Link to="/ekranlar">Ekranlar</Link>
            <Link to="/narxlar">Narxlar</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/faq">Savollar</Link>
          </nav>
          <div className="nav-cta">
            <Link to="/privacy" className="btn btn-ghost">
              Privacy
            </Link>
            <a
              href="https://hisvex-web.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              Boshlash <ArrowIcon />
            </a>
          </div>
          <button
            type="button"
            className="burger"
            id="burger"
            aria-label="Menyu"
            aria-expanded="false"
            aria-controls="burger-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="burger-menu" id="burger-menu">
          <Link to="/imkoniyatlar">Imkoniyatlar</Link>
          <Link to="/ekranlar">Ekranlar</Link>
          <Link to="/narxlar">Narxlar</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/faq">Savollar</Link>
          <a
            href="https://hisvex-web.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            style={{ justifyContent: "center", marginTop: 4 }}
          >
            Boshlash <ArrowIcon />
          </a>
        </div>
      </header>

      <span id="top"></span>

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow reveal">
              <span className="dot"></span>Bar, kafe va do'konlar uchun #1
              hisob-kitob
            </span>
            <h1 className="display reveal d1">
              Hisob-kitob <span className="it">mukammalligi</span> —
              cho'ntagingizda.
            </h1>
            <p className="lead reveal d2">
              Hisvex — mahsulot, ombor, savdo, qarzdor va statistikani{" "}
              <b style={{ color: "var(--text)" }}>bitta ilovada</b> boshqaradi.
              Internetsiz ham ishlaydi, har bir so'm aniq hisoblanadi — hech
              qanday anglashilmovchiliksiz.
            </p>
            <div className="hero-cta reveal d3">
              <a
                href="https://hisvex-web.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                Hoziroq boshlash <ArrowIcon />
              </a>
              <a
                href="#download-section"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("download-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-ghost"
              >
                Yuklab olish <DownloadArrowIcon />
              </a>
              <Link to="/ekranlar" className="btn btn-ghost">
                Ilovani ko'rish
              </Link>
            </div>
            <div className="hero-stats reveal d4">
              <div className="hstat">
                <div className="n" data-count="1200" data-suffix="+">
                  0
                </div>
                <div className="l">Savdo nuqtasi</div>
              </div>
              <div className="hstat">
                <div className="n" data-count="99" data-suffix="%">
                  0
                </div>
                <div className="l">Hisob aniqligi</div>
              </div>
              <div className="hstat">
                <div className="n">
                  24<span className="u">/</span>7
                </div>
                <div className="l">Offline rejim</div>
              </div>
            </div>
          </div>
          <div
            className="hero-visual reveal d3 tilt3d"
            data-tilt-x="7"
            data-tilt-y="11"
          >
            <div className="phone-back"></div>
            <div className="hero-badge hb1">
              <span
                className="ic"
                style={{ background: "rgba(52,211,153,.15)" }}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="#34D399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                Kunlik foyda<small>+18% bugun</small>
              </div>
            </div>
            <div className="hero-badge hb2">
              <span
                className="ic"
                style={{ background: "rgba(230,192,121,.15)" }}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="#E6C079"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                Bugungi tushum<small>4 250 000 so'm</small>
              </div>
            </div>
            <div className="phone float">
              <div className="notch"></div>
              <div className="screen">
                <AppPhone idx={0} />
              </div>
            </div>
          </div>
        </div>
        <div className="platform-strip reveal d4">
          <span className="ps-label">Bitta hisob — barcha qurilmalarda:</span>
          <div className="ps-icons">
            <span className="ps-chip">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              Windows
            </span>
            <span className="ps-chip">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              macOS
            </span>
            <span className="ps-chip">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.199.009.4.058.576.135.445.2.79.536.927 1.008.136.464.064.945-.132 1.354-.199.415-.53.772-.893.97-.099.047-.199.08-.3.115-.57.134-1.146.048-1.656-.136-.36-.135-.67-.333-.864-.535-.136-.135-.3-.334-.365-.469l-.003-.003c-.332-.536-.866-.867-1.356-.971a.37.37 0 00-.137-.024c-1.356 0-2.12 1.48-2.17 1.579-.07.093-.67.867-1.895.867-.178 0-.36-.012-.543-.035a5.56 5.56 0 01-.388.106c-.642.134-1.37.047-1.98-.398-.61-.447-.982-1.16-.982-1.864 0-.267.038-.534.113-.795.148-.408.442-.771.722-1.06.13-.135.263-.267.365-.334.136-.09.225-.18.262-.267.022-.135-.013-.267-.072-.4-.136-.334-.52-.535-.916-.601-.396-.067-.807-.003-1.133.2-.326.2-.57.536-.774.901-.203.364-.36.762-.565.961-.204.2-.527.334-.858.267a1.78 1.78 0 01-.666-.335c-.199-.2-.332-.535-.466-.867-.134-.332-.268-.664-.535-.864-.267-.2-.6-.267-.93-.134-.334.135-.6.4-.865.667-.265.267-.53.534-.864.667-.333.134-.73.134-1.062-.067-.334-.2-.565-.601-.732-1.068-.167-.466-.265-.998-.132-1.531.133-.534.398-1.069.797-1.535.4-.466.866-.8 1.265-.934.4-.134.665-.334.798-.667.133-.334.133-.735-.067-1.135-.2-.4-.532-.734-.93-.934-.399-.2-.864-.267-1.265-.067-.4.2-.665.6-.865 1.068-.2.466-.332.999-.332 1.466 0 .134.012.267.023.4.014.134.025.267.025.334 0 .267-.133.467-.333.601-.2.134-.465.2-.73.134-.267-.067-.466-.268-.6-.535-.133-.267-.2-.534-.267-.867-.066-.334-.132-.668-.132-1.002 0-.334.067-.668.2-1.002.133-.334.266-.667.465-.867.2-.2.4-.334.666-.4.267-.068.532-.068.8-.003.265.065.465.2.664.4.2.2.333.4.466.667.133.267.2.534.332.868.134.333.267.667.267 1.067 0 .4-.067.734-.2 1.001-.133.267-.2.534-.333.734-.133.2-.2.4-.4.534-.2.134-.4.2-.665.2h-.003c-.266 0-.532-.066-.73-.267-.2-.2-.333-.467-.4-.734-.068-.267-.068-.534-.068-.801 0-.267.068-.534.133-.801.066-.267.2-.534.333-.734.132-.2.265-.4.4-.534.132-.133.265-.2.4-.267.132-.066.265-.066.4-.066.133 0 .266.066.4.133.134.067.266.2.333.334.067.133.132.267.132.4 0 .133-.065.267-.132.4-.067.133-.133.267-.266.334-.133.066-.2.133-.333.133h-.002c-.133 0-.266-.067-.332-.133-.067-.067-.133-.2-.2-.334-.066-.133-.132-.267-.132-.4 0-.133.066-.267.132-.4.067-.133.133-.2.2-.267.067-.066.133-.133.266-.133.133 0 .2.067.266.133.067.067.133.134.133.267 0 .067-.067.134-.133.134-.066.066-.133.133-.266.133-.133 0-.2-.067-.266-.133-.067-.067-.067-.134-.067-.267 0-.133.067-.2.133-.267.067-.066.133-.066.2-.066z" />
              </svg>
              Linux
            </span>
            <span className="ps-chip">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.85-.31-.16-.69-.04-.85.27l-1.87 3.23c-1.15-.48-2.44-.75-3.8-.75s-2.65.27-3.8.75L6.98 5.72c-.16-.31-.54-.43-.85-.27-.31.16-.43.55-.27.85L7.7 9.48C4.48 11.24 2.28 14.38 2 18h20c-.28-3.62-2.48-6.76-5.7-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
              </svg>
              Android
            </span>
            <span className="ps-chip">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Veb-brauzer
            </span>
            <span className="ps-sync">
              <i></i>Real vaqtda sinxron
            </span>
          </div>
        </div>
        <div className="marquee">
          <div className="marquee-track">
            <span>Mahsulotlar</span>
            <span>Kunlik ombor</span>
            <span>Tezkor savdo</span>
            <span>Qarzdorlar</span>
            <span>Statistika &amp; Reyting</span>
            <span>Offline sync</span>
            <span>Blok kod himoyasi</span>
            <span>Mahsulotlar</span>
            <span>Kunlik ombor</span>
            <span>Tezkor savdo</span>
            <span>Qarzdorlar</span>
            <span>Statistika &amp; Reyting</span>
            <span>Offline sync</span>
            <span>Blok kod himoyasi</span>
          </div>
        </div>
      </section>

      <section className="sec" id="imkoniyatlar">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">
              <span className="dot"></span>Imkoniyatlar
            </span>
            <h2 className="section-title">
              Biznesingizni boshqarish uchun{" "}
              <span className="grad-text">hamma narsa</span>
            </h2>
            <p className="lead">
              Bir nechta dasturni almashtiradigan, kassir uchun maxsus
              o'ylangan, oddiy va kuchli vositalar.
            </p>
          </div>
          <div className="bento">
            <div className="f-card span3 feature-big reveal d1">
              <div>
                <div className="f-ic">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3>Mahsulotlar boshqaruvi</h3>
                <p>
                  Rasm, narx, qoldiq va barcode bilan cheksiz mahsulot. Bir
                  tegishda tahrirlash va qayta to'ldirish.
                </p>
              </div>
              <div className="big-metric">
                ∞ <span className="g">mahsulot</span>
              </div>
            </div>
            <div className="f-card span3 reveal d2">
              <div className="f-ic gold">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3v18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 14l3-4 3 3 4-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Statistika &amp; Reyting</h3>
              <p>
                Kunlik tushum, sof foyda, marja va eng ko'p sotilgan mahsulotlar
                — kun, oy va yil kesimida.
              </p>
            </div>
            <div className="f-card span2 reveal d1">
              <div className="f-ic">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="3"
                    width="16"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 8h8M8 12h8M8 16h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Kunlik ombor</h3>
              <p>
                Boshlang'ich qoldiqni belgilang — sotilgan miqdor avtomatik
                hisoblanadi.
              </p>
            </div>
            <div className="f-card span2 reveal d2">
              <div className="f-ic">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="20" r="1.6" fill="currentColor" />
                  <circle cx="18" cy="20" r="1.6" fill="currentColor" />
                  <path
                    d="M2 3h3l2.5 13h11l2-9H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Tezkor savdo</h3>
              <p>
                Savatga qo'shing, barcode skaner qiling va bir tegishda soting.
              </p>
            </div>
            <div className="f-card span2 reveal d3">
              <div className="f-ic gold">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Qarzdorlar</h3>
              <p>
                Kim, qancha qarz — to'liq tarix bilan. Qo'shish va yopishni
                kuzating.
              </p>
            </div>
            <div className="f-card span3 reveal d1">
              <div className="f-ic">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4 4 10-10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 5v7a9 9 0 1 1-9-9h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Offline-first &amp; Sync</h3>
              <p>
                Internet yo'qmi? Ilova lokal ishlaydi va aloqa tiklanganda
                serverga avtomatik sinxronlanadi.
              </p>
            </div>
            <div className="f-card span3 reveal d2">
              <div className="f-ic gold">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Biznes kun (00:00 emas)</h3>
              <p>
                Tungacha ishlaydigan barlar uchun: hisobot kunini o'zingiz
                belgilaysiz. Tungi savdo to'g'ri kunga yoziladi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="ekranlar">
        <div className="wrap">
          <div className="sec-head reveal" style={{ maxWidth: 720 }}>
            <span className="eyebrow">
              <span className="dot"></span>Ilova ichidan
            </span>
            <h2 className="section-title">
              Soddalik — bu{" "}
              <span
                className="it"
                style={{ fontStyle: "italic", color: "var(--gold)" }}
              >
                eng yuqori kuch
              </span>
            </h2>
            <p className="lead">
              Pastdagi menyuga bosib, barcha ekranlarni real ilovadagidek
              ko'ring.
            </p>
          </div>
          <div className="showcase">
            <div
              className="hero-visual reveal d1"
              style={{ minHeight: 600, flexDirection: "column" }}
            >
              <div className="phone tilt">
                <div className="notch"></div>
                <div className="screen">
                  <AppPhone idx={1} />
                </div>
              </div>
              <div className="tap-hint">
                <span className="k">☞</span> Pastdagi menyuga bosing
              </div>
            </div>
            <div className="show-list">
              <div className="show-item reveal d1">
                <span className="n">01</span>
                <div>
                  <h4>Real vaqtdagi hisob</h4>
                  <p>
                    Har bir savdo tushum va foydani darhol yangilaydi. Kun
                    yakunida qo'lda sanash shart emas.
                  </p>
                </div>
              </div>
              <div className="show-item reveal d2">
                <span className="n">02</span>
                <div>
                  <h4>Mahsulotlar reytingi</h4>
                  <p>
                    Qaysi mahsulot ko'p daromad keltiryapti? Reyting buni aniq
                    ko'rsatadi.
                  </p>
                </div>
              </div>
              <div className="show-item reveal d3">
                <span className="n">03</span>
                <div>
                  <h4>Davr bo'yicha tahlil</h4>
                  <p>Kun, oy va yil kesimida dinamikani kuzating.</p>
                </div>
              </div>
              <div className="show-item reveal d4">
                <span className="n">04</span>
                <div>
                  <h4>Eksport (CSV)</h4>
                  <p>
                    Hisobotlarni yuklab oling yoki ulashing. Telegramga
                    avtomatik kunlik hisobot keladi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">
              <span className="dot"></span>Qanday ishlaydi
            </span>
            <h2 className="section-title">4 qadamda ishga tushing</h2>
          </div>
          <div className="steps">
            <div className="step reveal d1">
              <div className="num"></div>
              <h4>Ro'yxatdan o'ting</h4>
              <p>Telefon raqamingiz bilan bir daqiqada hisob yarating.</p>
            </div>
            <div className="step reveal d2">
              <div className="num"></div>
              <h4>Mahsulot qo'shing</h4>
              <p>
                Nomi, narxi va qoldig'ini kiriting — yoki barcode skaner qiling.
              </p>
            </div>
            <div className="step reveal d3">
              <div className="num"></div>
              <h4>Soting</h4>
              <p>
                Har bir savdoni bir tegishda qayd eting. Qoldiq avtomatik
                kamayadi.
              </p>
            </div>
            <div className="step reveal d4">
              <div className="num"></div>
              <h4>Hisobotni ko'ring</h4>
              <p>Tushum, foyda va reytingni real vaqtda kuzating.</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="sec"
        id="download-section"
        style={{ scrollMarginTop: 80 }}
      >
        <div className="wrap">
          <div
            className="sec-head reveal"
            style={{ textAlign: "center", margin: "0 auto 54px" as any }}
          >
            <span className="eyebrow">
              <span className="dot"></span>Desktop versiya
            </span>
            <h2 className="section-title">
              Hisvexni <span className="grad-text">kompyuteringizda</span>{" "}
              ishlating
            </h2>
            <p className="lead" style={{ margin: "14px auto 0" }}>
              Katta ekranda yanada qulayroq boshqaring. Windows, macOS va Linux
              uchun maxsus ilova.
            </p>
          </div>

          <div className="desktop-showcase reveal">
            <div className="desktop-glow-wrap"><div className="desktop-glow"></div></div>
            <div
              className="desktop-monitor tilt3d"
              data-tilt-x="3"
              data-tilt-y="5"
            >
              <div className="monitor-bezel">
                <div className="monitor-camera">
                  <div className="cam-dot"></div>
                </div>
                <div className="monitor-controls">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="monitor-screen">
                <div className="desktop-app">
                  <div className="desktop-sidebar">
                    <div className="sidebar-brand">
                      <img
                        src="/logo.png"
                        alt="Hisvex"
                        style={{
                          width: 26,
                          height: 26,
                          objectFit: "contain",
                          flexShrink: 0,
                        }}
                      />
                      <span>
                        <span
                          style={{ color: "var(--violet)", fontWeight: 700 }}
                        >
                          is
                        </span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>
                          vex
                        </span>
                      </span>
                    </div>
                    <div className="sidebar-section">Asosiy</div>
                    <div className="sidebar-nav">
                      <div className="sidebar-item active">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Bosh sahifa
                        <span className="sidebar-badge">12</span>
                      </div>
                      <div className="sidebar-item">
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect
                            x="3"
                            y="3"
                            width="7"
                            height="7"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <rect
                            x="14"
                            y="3"
                            width="7"
                            height="7"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <rect
                            x="3"
                            y="14"
                            width="7"
                            height="7"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <rect
                            x="14"
                            y="14"
                            width="7"
                            height="7"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Mahsulotlar
                      </div>
                      <div className="sidebar-item">
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect
                            x="4"
                            y="3"
                            width="16"
                            height="18"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 8h8M8 12h8M8 16h5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Ombor
                      </div>
                      <div className="sidebar-item">
                        <svg viewBox="0 0 24 24" fill="none">
                          <circle cx="9" cy="20" r="1.6" fill="currentColor" />
                          <circle cx="18" cy="20" r="1.6" fill="currentColor" />
                          <path
                            d="M2 3h3l2.5 13h11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Savdo
                        <span className="sidebar-dot"></span>
                      </div>
                    </div>
                    <div className="sidebar-section">Tahlil</div>
                    <div className="sidebar-nav">
                      <div className="sidebar-item">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M4 20V10M10 20V4m6 16v-7m6 7v-3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Statistika
                      </div>
                      <div className="sidebar-item">
                        <svg viewBox="0 0 24 24" fill="none">
                          <ellipse
                            cx="12"
                            cy="6"
                            rx="7"
                            ry="3"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M5 6v6c0 1.6 3.1 3 7 3s7-1.4 7-3V6M5 12v5c0 1.6 3.1 3 7 3s7-1.4 7-3v-5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Qarzdorlar
                      </div>
                    </div>
                    <div className="sidebar-footer">
                      <div className="sidebar-user">
                        <div className="sidebar-avatar">A</div>
                        <div>
                          <div className="sidebar-uname">Akmal</div>
                          <div className="sidebar-role">Admin</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="desktop-main">
                    <div className="desktop-topbar">
                      <div className="topbar-left">
                        <div className="topbar-breadcrumb">
                          <span className="bc-home">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{ width: 14, height: 14 }}
                            >
                              <path
                                d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="bc-sep">/</span>
                          <span className="bc-current">Bosh sahifa</span>
                        </div>
                      </div>
                      <div className="topbar-right">
                        <div className="topbar-search">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ width: 14, height: 14, opacity: 0.5 }}
                          >
                            <circle
                              cx="11"
                              cy="11"
                              r="7"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="m20 20-3-3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>Qidirish...</span>
                          <span className="search-shortcut">⌘K</span>
                        </div>
                        <div className="topbar-actions">
                          <div className="topbar-icon-btn">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{ width: 16, height: 16 }}
                            >
                              <path
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13.73 21a2 2 0 0 1-3.46 0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="notif-dot"></span>
                          </div>
                          <div className="topbar-avatar">A</div>
                        </div>
                      </div>
                    </div>
                    <div className="desktop-content">
                      <div className="dc-header">
                        <div>
                          <h3 className="dc-title">Xush kelibsiz, Akmal</h3>
                          <p className="dc-subtitle">
                            Bugungi savdo holatingiz
                          </p>
                        </div>
                        <div className="dc-actions">
                          <div className="dc-btn">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{ width: 14, height: 14 }}
                            >
                              <path
                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Eksport
                          </div>
                          <div className="dc-btn primary">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{ width: 14, height: 14 }}
                            >
                              <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                              />
                            </svg>
                            Yangi sotish
                          </div>
                        </div>
                      </div>
                      <div className="desktop-stats-row">
                        <div className="d-stat">
                          <div className="d-stat-head">
                            <div className="d-stat-icon violet">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ width: 16, height: 16 }}
                              >
                                <path
                                  d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <span className="d-stat-change g">+12.5%</span>
                          </div>
                          <div className="d-stat-label">Bugungi tushum</div>
                          <div className="d-stat-value">
                            4 250 000 <small>so'm</small>
                          </div>
                          <div className="d-stat-spark">
                            <svg
                              viewBox="0 0 100 30"
                              preserveAspectRatio="none"
                            >
                              <polyline
                                points="0,25 15,22 30,18 45,20 60,12 75,8 100,5"
                                fill="none"
                                stroke="var(--violet)"
                                strokeWidth="2"
                              />
                              <polyline
                                points="0,25 15,22 30,18 45,20 60,12 75,8 100,5"
                                fill="url(#sg1)"
                                stroke="none"
                              />
                              <defs>
                                <linearGradient
                                  id="sg1"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="var(--violet)"
                                    stopOpacity=".3"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="var(--violet)"
                                    stopOpacity="0"
                                  />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="d-stat">
                          <div className="d-stat-head">
                            <div className="d-stat-icon emerald">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ width: 16, height: 16 }}
                              >
                                <path
                                  d="M20 6L9 17l-5-5"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <span className="d-stat-change g">+8 ta</span>
                          </div>
                          <div className="d-stat-label">Sotilgan</div>
                          <div className="d-stat-value g">
                            47 <small>dona</small>
                          </div>
                          <div className="d-stat-spark">
                            <svg
                              viewBox="0 0 100 30"
                              preserveAspectRatio="none"
                            >
                              <polyline
                                points="0,20 15,18 30,22 45,15 60,10 75,14 100,6"
                                fill="none"
                                stroke="var(--emerald)"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="d-stat">
                          <div className="d-stat-head">
                            <div className="d-stat-icon emerald">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ width: 16, height: 16 }}
                              >
                                <path
                                  d="M3 3v18h18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M7 14l3-4 3 3 4-6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <span className="d-stat-change g">+18%</span>
                          </div>
                          <div className="d-stat-label">Sof foyda</div>
                          <div className="d-stat-value g">
                            1 840 000 <small>so'm</small>
                          </div>
                          <div className="d-stat-spark">
                            <svg
                              viewBox="0 0 100 30"
                              preserveAspectRatio="none"
                            >
                              <polyline
                                points="0,22 15,20 30,15 45,18 60,8 75,12 100,3"
                                fill="none"
                                stroke="var(--emerald)"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="d-stat">
                          <div className="d-stat-head">
                            <div className="d-stat-icon rose">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ width: 16, height: 16 }}
                              >
                                <ellipse
                                  cx="12"
                                  cy="6"
                                  rx="7"
                                  ry="3"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M5 6v6c0 1.6 3.1 3 7 3s7-1.4 7-3V6M5 12v5c0 1.6 3.1 3 7 3s7-1.4 7-3v-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                            <span className="d-stat-change r">-2 ta</span>
                          </div>
                          <div className="d-stat-label">Qarzdorlar</div>
                          <div className="d-stat-value r">
                            850 000 <small>so'm</small>
                          </div>
                          <div className="d-stat-spark">
                            <svg
                              viewBox="0 0 100 30"
                              preserveAspectRatio="none"
                            >
                              <polyline
                                points="0,8 15,12 30,10 45,16 60,20 75,18 100,25"
                                fill="none"
                                stroke="var(--rose)"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="desktop-panels">
                        <div className="desktop-chart-panel">
                          <div className="panel-header">
                            <h4>Sotish dinamikasi</h4>
                            <div className="panel-tabs">
                              <span className="pt on">Hafta</span>
                              <span className="pt">Oy</span>
                              <span className="pt">Yil</span>
                            </div>
                          </div>
                          <div className="chart-area">
                            <svg
                              viewBox="0 0 400 140"
                              preserveAspectRatio="none"
                              className="chart-svg"
                            >
                              <defs>
                                <linearGradient
                                  id="cg1"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="var(--violet)"
                                    stopOpacity=".4"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="var(--violet)"
                                    stopOpacity="0"
                                  />
                                </linearGradient>
                              </defs>
                              <path
                                d="M0,110 C30,100 60,90 90,70 C120,50 150,60 180,45 C210,30 240,40 270,25 C300,10 330,20 360,15 L400,10 L400,140 L0,140Z"
                                fill="url(#cg1)"
                              />
                              <path
                                d="M0,110 C30,100 60,90 90,70 C120,50 150,60 180,45 C210,30 240,40 270,25 C300,10 330,20 360,15 L400,10"
                                fill="none"
                                stroke="var(--violet)"
                                strokeWidth="2.5"
                              />
                              <circle
                                cx="90"
                                cy="70"
                                r="4"
                                fill="var(--violet)"
                              />
                              <circle
                                cx="180"
                                cy="45"
                                r="4"
                                fill="var(--violet)"
                              />
                              <circle
                                cx="270"
                                cy="25"
                                r="4"
                                fill="var(--violet)"
                              />
                              <circle
                                cx="400"
                                cy="10"
                                r="4"
                                fill="var(--gold)"
                              />
                            </svg>
                            <div className="chart-labels">
                              <span>Dush</span>
                              <span>Sesh</span>
                              <span>Chor</span>
                              <span>Pay</span>
                              <span>Jum</span>
                              <span>Shan</span>
                              <span>Yak</span>
                            </div>
                          </div>
                        </div>
                        <div className="desktop-top-products">
                          <div className="panel-header">
                            <h4>Top mahsulotlar</h4>
                            <span className="panel-link">Barchasi →</span>
                          </div>
                          <div className="tp-list">
                            <div className="tp-item">
                              <span className="tp-rank">1</span>
                              <span className="tp-emoji">🍟</span>
                              <div className="tp-info">
                                <div className="tp-name">Lays</div>
                                <div className="tp-sold">320 ta sotildi</div>
                              </div>
                              <div className="tp-bar-wrap">
                                <div
                                  className="tp-bar"
                                  style={{ width: "92%" }}
                                ></div>
                              </div>
                              <div className="tp-rev">+1.9M</div>
                            </div>
                            <div className="tp-item">
                              <span className="tp-rank">2</span>
                              <span className="tp-emoji">🍫</span>
                              <div className="tp-info">
                                <div className="tp-name">Snikers</div>
                                <div className="tp-sold">264 ta sotildi</div>
                              </div>
                              <div className="tp-bar-wrap">
                                <div
                                  className="tp-bar"
                                  style={{ width: "76%" }}
                                ></div>
                              </div>
                              <div className="tp-rev">+1.4M</div>
                            </div>
                            <div className="tp-item">
                              <span className="tp-rank">3</span>
                              <span className="tp-emoji">⚡</span>
                              <div className="tp-info">
                                <div className="tp-name">Flash</div>
                                <div className="tp-sold">198 ta sotildi</div>
                              </div>
                              <div className="tp-bar-wrap">
                                <div
                                  className="tp-bar"
                                  style={{ width: "58%" }}
                                ></div>
                              </div>
                              <div className="tp-rev">+0.9M</div>
                            </div>
                            <div className="tp-item">
                              <span className="tp-rank">4</span>
                              <span className="tp-emoji">🥤</span>
                              <div className="tp-info">
                                <div className="tp-name">Gorilla</div>
                                <div className="tp-sold">112 ta sotildi</div>
                              </div>
                              <div className="tp-bar-wrap">
                                <div
                                  className="tp-bar"
                                  style={{ width: "34%" }}
                                ></div>
                              </div>
                              <div className="tp-rev">+0.6M</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="monitor-chin"></div>
            </div>
          </div>

          <div className="platform-cards reveal">
            <div className="platform-card">
              <div className="platform-glow win-glow"></div>
              <div className="platform-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: 32, height: 32 }}
                >
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
              </div>
              <h4>Windows</h4>
              <p>Windows 10 va 11 uchun</p>
              <div className="platform-note">
                Kassa kompyuterida tezkor ishlash uchun mo'ljallangan —
                klaviatura yorliqlari va barcode skaner qo'llab-quvvatlanadi.
              </div>
              <div className="platform-version">v1.0.6 · 108 MB</div>
              <a
                href={`${GH2}/Hisvex-Setup-1.0.6.exe`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold platform-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Yuklab olish
              </a>
            </div>
            <div className="platform-card">
              <div className="platform-glow mac-glow"></div>
              <div className="platform-icon mac">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: 32, height: 32 }}
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <h4>macOS</h4>
              <p>Intel va Apple Silicon</p>
              <div className="platform-note">
                Native ilova — Apple Silicon (M1 va undan keyingi) va Intel
                Mac'larda bir xil tezlikda ishlaydi.
              </div>
              <div className="platform-version">v1.0.6 · 129 MB</div>
              <a
                href={getMacDmg()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold platform-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Yuklab olish
              </a>
            </div>
            <div className="platform-card">
              <div className="platform-glow linux-glow"></div>
              <div className="platform-icon linux">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: 32, height: 32 }}
                >
                  <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.199.009.4.058.576.135.445.2.79.536.927 1.008.136.464.064.945-.132 1.354-.199.415-.53.772-.893.97-.099.047-.199.08-.3.115-.57.134-1.146.048-1.656-.136-.36-.135-.67-.333-.864-.535-.136-.135-.3-.334-.365-.469l-.003-.003c-.332-.536-.866-.867-1.356-.971a.37.37 0 00-.137-.024c-1.356 0-2.12 1.48-2.17 1.579-.07.093-.67.867-1.895.867-.178 0-.36-.012-.543-.035a5.56 5.56 0 01-.388.106c-.642.134-1.37.047-1.98-.398-.61-.447-.982-1.16-.982-1.864 0-.267.038-.534.113-.795.148-.408.442-.771.722-1.06.13-.135.263-.267.365-.334.136-.09.225-.18.262-.267.022-.135-.013-.267-.072-.4-.136-.334-.52-.535-.916-.601-.396-.067-.807-.003-1.133.2-.326.2-.57.536-.774.901-.203.364-.36.762-.565.961-.204.2-.527.334-.858.267a1.78 1.78 0 01-.666-.335c-.199-.2-.332-.535-.466-.867-.134-.332-.268-.664-.535-.864-.267-.2-.6-.267-.93-.134-.334.135-.6.4-.865.667-.265.267-.53.534-.864.667-.333.134-.73.134-1.062-.067-.334-.2-.565-.601-.732-1.068-.167-.466-.265-.998-.132-1.531.133-.534.398-1.069.797-1.535.4-.466.866-.8 1.265-.934.4-.134.665-.334.798-.667.133-.334.133-.735-.067-1.135-.2-.4-.532-.734-.93-.934-.399-.2-.864-.267-1.265-.067-.4.2-.665.6-.865 1.068-.2.466-.332.999-.332 1.466 0 .134.012.267.023.4.014.134.025.267.025.334 0 .267-.133.467-.333.601-.2.134-.465.2-.73.134-.267-.067-.466-.268-.6-.535-.133-.267-.2-.534-.267-.867-.066-.334-.132-.668-.132-1.002 0-.334.067-.668.2-1.002.133-.334.266-.667.465-.867.2-.2.4-.334.666-.4.267-.068.532-.068.8-.003.265.065.465.2.664.4.2.2.333.4.466.667.133.267.2.534.332.868.134.333.267.667.267 1.067 0 .4-.067.734-.2 1.001-.133.267-.2.534-.333.734-.133.2-.2.4-.4.534-.2.134-.4.2-.665.2h-.003c-.266 0-.532-.066-.73-.267-.2-.2-.333-.467-.4-.734-.068-.267-.068-.534-.068-.801 0-.267.068-.534.133-.801.066-.267.2-.534.333-.734.132-.2.265-.4.4-.534.132-.133.265-.2.4-.267.132-.066.265-.066.4-.066.133 0 .266.066.4.133.134.067.266.2.333.334.067.133.132.267.132.4 0 .133-.065.267-.132.4-.067.133-.133.267-.266.334-.133.066-.2.133-.333.133h-.002c-.133 0-.266-.067-.332-.133-.067-.067-.133-.2-.2-.334-.066-.133-.132-.267-.132-.4 0-.133.066-.267.132-.4.067-.133.133-.2.2-.267.067-.066.133-.133.266-.133.133 0 .2.067.266.133.067.067.133.134.133.267 0 .067-.067.134-.133.134-.066.066-.133.133-.266.133-.133 0-.2-.067-.266-.133-.067-.067-.067-.134-.067-.267 0-.133.067-.2.133-.267.067-.066.133-.066.2-.066z" />
                </svg>
              </div>
              <h4>Linux</h4>
              <p>Ubuntu, Fedora, Debian</p>
              <div className="platform-note">
                AppImage formatida — o'rnatishsiz, to'g'ridan-to'g'ri ishga
                tushiring. Har qanday distributivda ishlaydi.
              </div>
              <div className="platform-version">v1.0.3 · 134 MB</div>
              <a
                href={`${GH}/Hisvex-1.0.3.AppImage`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost platform-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Yuklab olish
              </a>
            </div>
            <div className="platform-card">
              <div className="platform-glow"></div>
              <div className="platform-icon android">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: 32, height: 32 }}
                >
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.85-.31-.16-.69-.04-.85.27l-1.87 3.23c-1.15-.48-2.44-.75-3.8-.75s-2.65.27-3.8.75L6.98 5.72c-.16-.31-.54-.43-.85-.27-.31.16-.43.55-.27.85L7.7 9.48C4.48 11.24 2.28 14.38 2 18h20c-.28-3.62-2.48-6.76-5.7-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                </svg>
              </div>
              <h4>Android</h4>
              <p>APK faylni to'g'ridan-to'g'ri yuklab oling</p>
              <div className="platform-note">
                Kassir uchun cho'ntakda — telefon yoki planshetda oflayn
                ishlaydi, aloqa tiklanganda avtomatik sinxronlanadi.
              </div>
              <div className="platform-version">v{MOBILE_APK_VERSION}</div>
              <a
                href={MOBILE_APK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost platform-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Yuklab olish
              </a>
            </div>
            <div className="platform-card">
              <div className="platform-glow"></div>
              <div className="platform-icon web">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 32, height: 32 }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h4>Web versiya</h4>
              <p>Brauzer orqali ishlating</p>
              <div className="platform-note">
                O'rnatishsiz — istalgan Chrome, Safari yoki Edge brauzeridan
                hisobingizga kiring va boshqaring.
              </div>
              <a
                href="https://hisvex-web.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold platform-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: 16, height: 16 }}
                >
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Ochish
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="narxlar">
        <div className="wrap">
          <div
            className="sec-head reveal"
            style={{ textAlign: "center", margin: "0 auto 54px" as any }}
          >
            <span className="eyebrow">
              <span className="dot"></span>Tariflar
            </span>
            <h2 className="section-title">
              Biznesingizga mos <span className="grad-text">tarif</span>
            </h2>
            <p className="lead" style={{ margin: "14px auto 0" }}>
              Kichik do'kondan kattagacha — har bir bosqich uchun.
            </p>
          </div>
          <div
            className="dur-toggle reveal"
            style={{ justifyContent: "center" }}
          >
            {[1, 6, 12].map((m) => (
              <button
                key={m}
                className={"dur-btn" + (dur === m ? " on" : "")}
                onClick={() => setDur(m)}
              >
                {m === 1 ? "1 oy" : m === 6 ? "6 oy" : "12 oy"}
                {m === 6 && <span className="dur-disc">−6%</span>}
                {m === 12 && <span className="dur-disc">−12%</span>}
              </button>
            ))}
          </div>
          <div className="prices" style={{ marginTop: 28 }}>
            <div className="price reveal d1">
              <div className="pname">Tekin</div>
              <div className="pdesc">
                Boshlab ko'rish va kichik nuqtalar uchun.
              </div>
              <div className="pcost">
                0 <small>so'm</small>
              </div>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Mahsulot va ombor
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Kunlik savdo
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Offline rejim
                </li>
                <li className="off">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Statistika &amp; Reyting
                </li>
              </ul>
              <a
                href="https://hisvex-web.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Boshlash
              </a>
            </div>
            <div className="price reveal d2">
              <div className="pname">Bor</div>
              <div className="pdesc">O'sib borayotgan do'konlar uchun.</div>
              <div className="pcost">
                {dur === 1 ? "44 000" : dur === 6 ? "248 160" : "464 640"}{" "}
                <small>so'm{dur > 1 ? "" : "/oy"}</small>
              </div>
              {dur > 1 && (
                <div className="dur-save">
                  ≈ {(dur === 6 ? 41360 : 38720).toLocaleString("uz-UZ")}{" "}
                  so'm/oy
                </div>
              )}
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {dur === 1 ? "100 ta mahsulotgacha" : "100 ta mahsulotgacha"}
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Savdo va qarzdorlar
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Offline sync
                </li>
                <li className="off">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Cheksiz miqyos
                </li>
              </ul>
              <a
                href="https://t.me/dilbek7011"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Tanlash
              </a>
            </div>
            <div className="price feat reveal d3">
              <span className="tag">Ommabop</span>
              <div className="pname">Pro</div>
              <div className="pdesc">To'liq imkoniyatlar, cheksiz miqyos.</div>
              <div className="pcost">
                {dur === 1 ? "99 000" : dur === 6 ? "558 360" : "1 045 440"}{" "}
                <small>so'm{dur > 1 ? "" : "/oy"}</small>
              </div>
              {dur > 1 && (
                <div className="dur-save">
                  ≈ {(dur === 6 ? 93060 : 87120).toLocaleString("uz-UZ")}{" "}
                  so'm/oy
                </div>
              )}
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <b>Cheksiz</b> mahsulot
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  To'liq Statistika &amp; Reyting
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Telegram hisobotlari
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Ustuvor qo'llab-quvvatlash
                </li>
              </ul>
              <a
                href="https://t.me/dilbek7011"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                Pro olish <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="privacy">
        <div className="wrap">
          <div className="sec-shield reveal">
            <div>
              <span className="eyebrow">
                <span className="dot"></span>Privacy
              </span>
              <h2
                className="section-title"
                style={{
                  margin: "18px 0 14px",
                  fontSize: "clamp(28px,3.5vw,42px)",
                }}
              >
                Ma'lumotlaringiz <span className="grad-text">maxfiy</span>
              </h2>
              <p className="lead" style={{ marginBottom: 30 }}>
                Hisvex mijoz ma'lumotlarini uchinchi tomonga uzatmaydi. Barcha
                yozuvlar faqat sizning qurilmangiz va hisobingizda.
              </p>
              <div className="shield-list">
                <div className="shield-item">
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 6v6l4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <h4>Ma'lumot sizniki</h4>
                    <p>
                      Savdo, mahsulot va mijoz ma'lumotlari faqat sizga tegishli
                      — biz ulardan foydalanmaymiz.
                    </p>
                  </div>
                </div>
                <div className="shield-item">
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <h4>Shifrlangan saqlash</h4>
                    <p>
                      Barcha ma'lumotlar shifrlangan holda saqlanadi va
                      uzatiladi.
                    </p>
                  </div>
                </div>
                <div className="shield-item">
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 12a9 9 0 1 1-9-9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M21 4v5h-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <h4>Nazorat sizda</h4>
                    <p>
                      Istalgan vaqtda ma'lumotlarni eksport qilish yoki hisobni
                      o'chirish mumkin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="shield-visual">
              <div className="shield-ring">
                <div className="shield-core">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap">
          <div
            className="sec-head reveal"
            style={{ textAlign: "center", margin: "0 auto 50px" as any }}
          >
            <span className="eyebrow">
              <span className="dot"></span>Savol-javob
            </span>
            <h2 className="section-title">Tez-tez beriladigan savollar</h2>
          </div>
          <div className="faq">
            <div className="q reveal">
              <button
                type="button"
                className="q-head"
                aria-expanded="false"
                aria-controls="faq-a-0"
              >
                Internet bo'lmasa ishlaydimi?<span className="pm">+</span>
              </button>
              <div className="q-body" id="faq-a-0">
                <p>
                  Ha. Hisvex offline-first ishlaydi — barcha mahsulot, savdo va
                  ombor lokal saqlanadi. Internet tiklanganda avtomatik
                  sinxronlanadi.
                </p>
              </div>
            </div>
            <div className="q reveal">
              <button
                type="button"
                className="q-head"
                aria-expanded="false"
                aria-controls="faq-a-1"
              >
                Ma'lumotlarim yo'qolib qoladimi?<span className="pm">+</span>
              </button>
              <div className="q-body" id="faq-a-1">
                <p>
                  Yo'q. Ma'lumotlar ham qurilmada, ham serverda saqlanadi.
                  Telefon almashtirsangiz ham hisobingizga kirib, hammasini
                  qaytarib olasiz.
                </p>
              </div>
            </div>
            <div className="q reveal">
              <button
                type="button"
                className="q-head"
                aria-expanded="false"
                aria-controls="faq-a-2"
              >
                Bir nechta qurilmada ishlata olamanmi?
                <span className="pm">+</span>
              </button>
              <div className="q-body" id="faq-a-2">
                <p>
                  Ha. Bitta hisob bilan bir nechta qurilmada sinxronlangan holda
                  ishlashingiz mumkin.
                </p>
              </div>
            </div>
            <div className="q reveal">
              <button
                type="button"
                className="q-head"
                aria-expanded="false"
                aria-controls="faq-a-3"
              >
                Hisob-kitob qanchalik aniq?<span className="pm">+</span>
              </button>
              <div className="q-body" id="faq-a-3">
                <p>
                  Har bir sotilgan dona, narx va foyda bitta mantiq bo'yicha
                  hisoblanadi — telefon va serverda bir xil natija.
                  Anglashilmovchilik bo'lmaydi.
                </p>
              </div>
            </div>
            <div className="q reveal">
              <button
                type="button"
                className="q-head"
                aria-expanded="false"
                aria-controls="faq-a-4"
              >
                Qanday to'lov qilaman?<span className="pm">+</span>
              </button>
              <div className="q-body" id="faq-a-4">
                <p>
                  Tarif va to'lov uchun Telegram orqali bog'laning:{" "}
                  <a
                    href="https://t.me/dilbek7011"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--gold)" }}
                  >
                    @dilbek7011
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="cta-wrap reveal">
            <div className="cta-glow"></div>
            <span className="eyebrow">
              <span className="dot"></span>Bugun boshlang
            </span>
            <h2 style={{ marginTop: 18 }}>
              Biznesingiz{" "}
              <span
                className="it"
                style={{ fontStyle: "italic", color: "var(--gold)" }}
              >
                aniq raqamlarni
              </span>{" "}
              kutmoqda
            </h2>
            <p className="lead">
              Hisvex bilan har bir so'mni nazoratga oling. Bugun o'rnating —
              ertaga farqini ko'ring.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://hisvex-web.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                Hoziroq boshlash <ArrowIcon />
              </a>
              <Link to="/imkoniyatlar" className="btn btn-ghost">
                Imkoniyatlarni ko'rish
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <Link to="/top" className="brand" style={{ gap: 10 }}>
                <img
                  src="/hisvex-logo-icon.png"
                  alt="Hisvex"
                  style={{
                    width: 52,
                    height: 52,
                    objectFit: "contain",
                    display: "block",
                    marginRight: -12,
                    paddingTop: 5,
                  }}
                />
                <span>
                  <span
                    style={{ color: "#8B5CF6", fontSize: 28, fontWeight: 700 }}
                  >
                    is
                  </span>
                  <span
                    style={{ color: "#FFF", fontSize: 28, fontWeight: 700 }}
                  >
                    vex
                  </span>
                </span>
              </Link>
              <p>
                Bar, kafe va do'konlar uchun premium hisob-kitob ilovasi. Oddiy,
                tez va ishonchli.
              </p>
              <a
                href="https://t.me/dilbek7011"
                target="_blank"
                rel="noopener noreferrer"
                className="tg-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M22 3 2 10.5l5.5 2L17 6l-7 8.5V20l3-3.5 4 3z" />
                </svg>
                @dilbek7011
              </a>
            </div>
            <div className="foot-col">
              <h5>Mahsulot</h5>
              <Link to="/imkoniyatlar">Imkoniyatlar</Link>
              <Link to="/ekranlar">Ekranlar</Link>
              <Link to="/narxlar">Narxlar</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
            <div className="foot-col">
              <h5>Kompaniya</h5>
              <Link to="/faq">Savol-javob</Link>
              <a
                href="https://t.me/dilbek7011"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bog'lanish
              </a>
              <Link to="/top">Boshiga</Link>
            </div>
            <div className="foot-col">
              <h5>Huquqiy</h5>
              <Link to="/terms">Foydalanish shartlari</Link>
              <Link to="/privacy">Maxfiylik siyosati</Link>
            </div>
          </div>
          <div className="foot-bot">
            <span>
              © <span id="year"></span> Hisvex. Barcha huquqlar himoyalangan.
            </span>
            <span>O'zbekistonda 🇺🇿 ishlab chiqilgan</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
