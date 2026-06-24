import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import {
  phoneDisplay,
  phoneHref,
  whatsappHref,
  email,
  instagramHref,
  navItems,
  PrimaryButton,
  SectionTag,
} from './shared.jsx'

const sectionsPromise = import('./Sections.jsx')
const Sections = lazy(() => sectionsPromise)

function useStarfield() {
  useEffect(() => {
    const setup = () => {
      function rand(max) {
        return Math.floor(Math.random() * max)
      }
      function makeShadow(n, w, h) {
        const parts = []
        for (let i = 0; i < n; i++) {
          parts.push(`${rand(w)}px ${rand(h)}px #fff`)
        }
        return parts.join(',')
      }
      const isMobile = window.innerWidth < 768
      const counts = isMobile ? [150, 50, 20] : [350, 100, 50]
      const w = Math.max(window.innerWidth, 1400)
      const h = 2000
      const root = document.documentElement
      root.style.setProperty('--star1', makeShadow(counts[0], w, h))
      root.style.setProperty('--star2', makeShadow(counts[1], w, h))
      root.style.setProperty('--star3', makeShadow(counts[2], w, h))
    }

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(setup, { timeout: 2000 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(setup, 200)
    return () => clearTimeout(id)
  }, [])
}

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      {...props}
    >
      <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
    </svg>
  )
}

function Header({ privacy = false }) {
  const [navOpen, setNavOpen] = useState(false)
  const [socialsOpen, setSocialsOpen] = useState(false)
  const frameRef = useRef(null)
  const items = privacy ? [{ label: 'Home', href: '/' }] : navItems

  useEffect(() => {
    document.body.classList.toggle('nav-locked', navOpen)
    if (!navOpen) setSocialsOpen(false)
    return () => document.body.classList.remove('nav-locked')
  }, [navOpen])

  useEffect(() => {
    if (!navOpen) return

    function handlePointerDown(event) {
      if (frameRef.current && !frameRef.current.contains(event.target)) {
        setNavOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [navOpen])

  return (
    <header className="site-header" data-open={navOpen}>
      <div className="nav-frame" ref={frameRef}>
        <button
          className="menu-button"
          type="button"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((current) => !current)}
        >
          <span className="bar bar1" aria-hidden="true" />
          <span className="bar bar2" aria-hidden="true" />
          <span className="bar bar3" aria-hidden="true" />
        </button>

        <nav className="nav-links" aria-label="Primary navigation">
          <span className="nav-brand">Programming &amp; Coding Solutions</span>
          {items.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setNavOpen(false)}>
              {item.label}
            </a>
          ))}
          {!privacy ? (
            <div className="nav-footer">
              <a className="nav-cta" href="#contact" onClick={() => setNavOpen(false)}>
                Book a Call
              </a>
              <div className={`nav-socials${socialsOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="nav-social-trigger"
                  aria-expanded={socialsOpen}
                  onClick={() => setSocialsOpen((current) => !current)}
                >
                  Socials
                </button>
                <div className="nav-social-links">
                  <a
                    className="nav-social-link"
                    href={instagramHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        <picture>
          <source
            type="image/webp"
            srcSet="/assets/Hero-240.webp 240w, /assets/Hero-320.webp 320w, /assets/Hero-480.webp 480w, /assets/Hero-960.webp 960w, /assets/Hero-1440.webp 1440w, /assets/Hero-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/assets/Hero-960.jpg"
            srcSet="/assets/Hero-240.jpg 240w, /assets/Hero-320.jpg 320w, /assets/Hero-480.jpg 480w, /assets/Hero-960.jpg 960w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div className="animated-gradient" aria-hidden="true" />
      <div className="container hero-inner">
        <picture className="hero-logo-wrap">
          <source type="image/webp" srcSet="/assets/logo.webp" />
          <img className="hero-logo" src="/assets/logo.png" alt="PR REMAPS logo" width="1536" height="1024" />
        </picture>
        <h1 className="hero-line">
          <span className="hero-line-1">Vehicle software solutions with</span>
          <br />
          <span className="text-accent hero-line-2">dealer-level diagnostics</span>
        </h1>
        <p>
          Programming &amp; Coding Solutions are vehicle software programming specialists —
          providing mobile AdBlue, SCR, NOx, EGR, ECU remapping and dealer-level diagnostics
          across London, Kent and Essex.
        </p>

        <div className="hero-actions">
          <PrimaryButton href="#contact">Request a Quote</PrimaryButton>
          <a className="secondary-button" href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>

        <div className="hero-detail">
          <span>London / Kent / Essex</span>
          <i aria-hidden="true" />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
          </svg>
          <i aria-hidden="true" />
          <span>Dealer-level diagnostics</span>
        </div>
      </div>
    </section>
  )
}

export function App() {
  useStarfield()

  return (
    <>
      <div className="star-bg" aria-hidden="true">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
      </div>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Sections />
        </Suspense>
      </main>
    </>
  )
}

export function PrivacyPage() {
  const policySections = useMemo(
    () => [
      {
        title: 'Who we are',
        body: 'Programming and Coding Solutions (also trading as PR REMAPS) is the data controller for personal information collected through this website. You can contact us at progandcod@gmail.com or by phone on +44 7783 597186.',
      },
      {
        title: 'What data we collect',
        body: 'When you submit the quote request form we collect your name, email address, phone number, vehicle make and model, and a description of your service requirements.',
      },
      {
        title: 'Legal basis for processing',
        body: 'We process your data on the basis of legitimate interest (Article 6(1)(f) UK GDPR) — specifically, to communicate with prospective customers who have voluntarily contacted us. We do not use your data for marketing without your separate consent.',
      },
      {
        title: 'How we use your data',
        body: 'Your data is used only to respond to your enquiry and provide service guidance. We do not sell, rent or share your personal information with any third party for their own purposes.',
      },
      {
        title: 'Third-party processors',
        body: 'Form submissions are processed by Web3Forms (web3forms.com), a third-party service that delivers your enquiry to our inbox. Web3Forms may process your data on servers outside the UK. No other third parties receive your personal data.',
      },
      {
        title: 'How long we keep your data',
        body: 'Enquiry data is retained for a maximum of 12 months, after which it is deleted. If your enquiry results in an ongoing service relationship, records may be kept for up to 6 years to comply with HMRC requirements.',
      },
      {
        title: 'Cookies',
        body: 'This website does not use cookies or any other tracking technologies. No personal data is stored in your browser.',
      },
      {
        title: 'Your rights',
        body: 'Under UK GDPR you have the right to:',
        list: [
          'Access — request a copy of the data we hold about you',
          'Rectification — ask us to correct inaccurate data',
          'Erasure — ask us to delete your data',
          'Restriction — ask us to limit how we process your data',
          'Portability — receive your data in a portable format',
          'Object — object to processing based on legitimate interests',
        ],
        bodyAfter: 'To exercise any of these rights, email us at progandcod@gmail.com. We will respond within one month.',
      },
      {
        title: 'Complaints',
        body: "If you have concerns about how we handle your data you have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk or by calling 0303 123 1113.",
      },
    ],
    []
  )

  return (
    <>
      <Header privacy />
      <main className="privacy-page">
        <section className="hero privacy-hero">
          <div className="animated-gradient" aria-hidden="true" />
          <div className="container hero-inner">
            <SectionTag>Privacy</SectionTag>
            <h1>Privacy Policy</h1>
            <p>How Programming &amp; Coding Solutions collects, uses and protects your data. Last updated: June 2026.</p>
          </div>
        </section>
        <section className="section">
          <div className="container policy-grid">
            {policySections.map(({ title, body, list, bodyAfter }) => (
              <article className="policy-card" key={title}>
                <h2>{title}</h2>
                {body && <p>{body}</p>}
                {list && (
                  <ul className="policy-list">
                    {list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {bodyAfter && <p>{bodyAfter}</p>}
              </article>
            ))}
            <article className="policy-card policy-card--wide">
              <h2>Contact us</h2>
              <p>
                Email: <a href={`mailto:${email}`}>{email}</a>
                <br />
                Phone: <a href={phoneHref}>{phoneDisplay}</a>
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
