import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Car,
  Check,
  ChevronDown,
  Gauge,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react'
import StarRating from './components/StarRating.jsx'

const phoneDisplay = '+44 7783 597186'
const phoneHref = 'tel:+447783597186'
const whatsappHref = 'https://wa.me/447783597186'
const email = 'progandcod@gmail.com'
const accentRed = '#dc323f'
const instagramHref = 'https://www.instagram.com/pr_remaps'

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
]

const brandTicker = [
  'BMW / MINI',
  'Mercedes-Benz',
  'VAG Group',
  'Ford',
  'Peugeot',
  'Citroen',
  'Range Rover',
  'Renault',
  'Vauxhall',
  'Toyota',
  'Nissan',
  'Honda',
  'Volvo',
  'Jaguar',
  'Fiat',
  'Hyundai',
  'Kia',
  'Mazda',
]

const projects = [
  {
    label: 'AdBlue / SCR',
    title: 'Countdowns, dosing faults and limp mode support.',
    meta: 'Mobile diagnostic route',
    image: '/assets/Hero-960.jpg',
  },
  {
    label: 'NOx / EGR',
    title: 'Recurring emissions faults checked before programming.',
    meta: 'Live data + fault history',
    image: '/assets/AboutUs-960.jpg',
  },
  {
    label: 'ECU',
    title: 'Coding, calibration and remapping for supported vehicles.',
    meta: 'Licensed software workflow',
    image: '/assets/Hero-480.jpg',
  },
  {
    label: 'Diagnostics',
    title: 'Dealer-level checks before any permanent solution.',
    meta: 'London, Kent and Essex',
    image: '/assets/AboutUs-480.jpg',
  },
]

const skills = [
  'AdBlue',
  'SCR',
  'NOx',
  'EGR',
  'ECU coding',
  'Remapping',
  'Diagnostics',
  'Live data',
  'Mobile support',
]

const whyChoices = [
  {
    title: 'Diagnostic-first approach',
    body: 'Every fault is checked and confirmed before any coding, calibration or programming begins.',
  },
  {
    title: 'Mobile coverage',
    body: 'On-site appointments across London, Kent and Essex.',
  },
  {
    title: 'Dealer-level equipment',
    body: 'Stored codes and live data are checked with professional diagnostic tools.',
  },
  {
    title: 'Licensed software',
    body: 'Coding, calibration and remapping completed through a licensed software workflow.',
  },
]

const processSteps = [
  {
    title: 'Fault brief',
    body: 'Vehicle details, dashboard messages and codes are reviewed before the visit.',
  },
  {
    title: 'Diagnostic session',
    body: 'Stored codes, live data and system behaviour are checked with professional tools.',
  },
  {
    title: 'Programming route',
    body: 'Where suitable, coding, calibration or ECU work is completed with licensed software.',
  },
]

const services = [
  {
    icon: Gauge,
    title: 'AdBlue and SCR',
    body: 'Countdown warnings, dosing faults, pressure issues and SCR efficiency problems.',
  },
  {
    icon: ShieldCheck,
    title: 'NOx sensor faults',
    body: 'Signal, range and catalyst efficiency checks before any software recommendation.',
  },
  {
    icon: Wrench,
    title: 'EGR system support',
    body: 'Flow, valve and system performance faults investigated with a diagnostic-first route.',
  },
  {
    icon: Car,
    title: 'ECU remapping',
    body: 'Driveability-focused calibration, coding and programming for supported brands.',
  },
]

const reviews = [
  {
    name: 'Same-day support',
    quote: 'Clear diagnosis, professional tools and the vehicle was out of limp mode the same day.',
    rating: 5,
  },
  {
    name: 'Mobile appointment',
    quote: 'Arrived prepared, explained the fault path and completed the programming on site.',
    rating: 4.9,
  },
  {
    name: 'Dealer-level checks',
    quote: 'Straight answer on what needed software and what needed further repair work.',
    rating: 5,
  },
]

const faqs = [
  ['Can you come to me?', 'Yes. Mobile support is available across London, Kent and Essex.'],
  [
    'Do I need fault codes first?',
    'No. Fault codes help, but we can diagnose warning lights and stored faults on arrival.',
  ],
  [
    'Is everything handled through software?',
    'No. We check the root cause first and only recommend coding or programming when it is suitable.',
  ],
  [
    'Which vehicles do you support?',
    'Common supported brands include BMW, MINI, VAG, Mercedes-Benz, Ford, Peugeot, Citroen, Renault and Land Rover.',
  ],
]

function useStarfield() {
  useEffect(() => {
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
    const w = Math.max(window.innerWidth, 1400)
    const h = 2000
    const root = document.documentElement
    root.style.setProperty('--star1', makeShadow(700, w, h))
    root.style.setProperty('--star2', makeShadow(200, w, h))
    root.style.setProperty('--star3', makeShadow(100, w, h))
  }, [])
}

function useRevealOnScroll() {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll('.reveal'))
    if (!revealElements.length) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('in-view'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function SectionTag({ children }) {
  return (
    <span className="section-tag">
      <Sparkles size={14} aria-hidden="true" />
      {children}
    </span>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" {...props}>
      <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
    </svg>
  )
}

function PrimaryButton({ href, children, external = false }) {
  return (
    <a
      className="glow-button"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span>{children}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  )
}

function Header({ privacy = false }) {
  const [navOpen, setNavOpen] = useState(false)
  const [socialsOpen, setSocialsOpen] = useState(false)
  const frameRef = useRef(null)
  const items = privacy ? [{ label: 'Home', href: '/' }] : navItems

  useEffect(() => {
    document.body.classList.toggle('nav-locked', navOpen)
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
        <img
          src="/assets/Hero-960.jpg"
          srcSet="/assets/Hero-240.jpg 240w, /assets/Hero-320.jpg 320w, /assets/Hero-480.jpg 480w, /assets/Hero-960.jpg 960w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="animated-gradient" aria-hidden="true" />
      <div className="container hero-inner">
        <img className="hero-logo" src="/assets/logo.png" alt="PR REMAPS logo" width="1536" height="1024" />
        <h1 className="hero-line">
          Vehicle software solutions with <span className="text-accent">diagnostic precision.</span>
        </h1>
        <p>
          Programming &amp; Coding Solutions provides mobile AdBlue, SCR, NOx, EGR, ECU remapping
          and dealer-level diagnostics across London, Kent and Essex.
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
          <Zap size={18} aria-hidden="true" />
          <i aria-hidden="true" />
          <span>Dealer-level diagnostics</span>
        </div>
      </div>
    </section>
  )
}

function BrandTicker() {
  const repeated = Array(4).fill(brandTicker).flat()

  return (
    <section className="ticker-strip" aria-label="Supported vehicle brands">
      <div className="ticker-track">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="section work-section" id="work">
      <div className="work-grid reveal">
        <div className="work-copy">
          <h2>Common jobs handled with a clear diagnostic route.</h2>

          <div className="project-carousel">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-image">
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="project-card__body">
                  <span>{project.label}</span>
                  <h3>{project.title}</h3>
                  <div>
                    <small>{project.meta}</small>
                    <a href="#contact" aria-label={`Ask about ${project.label}`}>
                      View
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="work-media">
          <video
            src="/assets/work-road.mp4"
            poster="/assets/Hero-960.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div className="about-copy reveal">
          <SectionTag>About</SectionTag>
          <h2>Diagnostic-led programming, not guesswork.</h2>
          <p>
            Every job starts by inspecting the fault, confirming the route, then completing suitable
            coding, calibration or ECU work with professional tools.
          </p>

          <div className="about-panels">
            <article>
              <strong>10+</strong>
              <span>Years experience</span>
            </article>
            <article>
              <strong>500+</strong>
              <span>Vehicles tuned</span>
            </article>
          </div>
        </div>

        <div className="why-panel reveal">
          <SectionTag>Why Choose Us</SectionTag>
          <div className="why-list">
            {whyChoices.map((item) => (
              <article key={item.title}>
                <span className="why-icon" aria-hidden="true">
                  <Check size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section process-section" id="process">
      <div className="container process-grid">
        <div className="process-image reveal">
          <img
            src="/assets/AboutUs-960.jpg"
            alt="Diagnostic equipment in use"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="process-content reveal">
          <SectionTag>Process</SectionTag>
          <h2>A clear route from fault report to final test.</h2>
          <div className="process-list">
            {processSteps.map((step, index) => (
              <article className="process-card" key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="services-top reveal">
          <div>
            <SectionTag>Services</SectionTag>
            <h2>Specialist vehicle software services.</h2>
          </div>
          <p>
            Mobile support for emissions faults, diagnostics, coding and ECU programming across
            London, Kent and Essex.
          </p>
          <div className="skill-cloud">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>

        <div className="service-bento reveal">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <article className="service-tile" key={service.title}>
                <div className="service-icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section reviews-section" id="reviews">
      <div className="container reviews-grid">
        <div className="reviews-copy reveal">
          <SectionTag>Feedback</SectionTag>
          <h2>Customer confidence built on clear diagnostics.</h2>
          <p>
            Practical advice, professional equipment and clear communication from first message to
            final road test.
          </p>
          <div className="stat-row">
            <article>
              <strong>98%</strong>
              <span>Customer satisfaction</span>
            </article>
            <article>
              <strong>2h</strong>
              <span>Typical response window</span>
            </article>
          </div>
        </div>

        <div className="review-list reveal">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-head">
                <span className="review-avatar" aria-hidden="true">
                  <MessageCircle size={20} aria-hidden="true" />
                </span>
                <strong>{review.name}</strong>
              </div>
              <StarRating
                rating={review.rating}
                starSize={18}
                textSize={15}
                filledColor={accentRed}
              />
              <p>{review.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactAndFaq() {
  const [status, setStatus] = useState({ message: '', type: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setSubmitting(true)
    setStatus({ message: 'Sending your message...', type: 'pending' })

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      })
      const result = await response.json()

      if (response.ok && result.success) {
        form.reset()
        setStatus({ message: 'Thanks. Your message has been sent.', type: 'success' })
      } else {
        setStatus({
          message: 'Sorry, the message failed to send. Please try again.',
          type: 'error',
        })
      }
    } catch {
      setStatus({ message: 'Sorry, the message failed to send. Please try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section contact-faq-section" id="contact">
      <div className="container contact-faq-grid">
        <div className="faq-column reveal">
          <SectionTag>FAQ</SectionTag>
          <h2>Before you book.</h2>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="contact-card reveal">
          <SectionTag>Book</SectionTag>
          <h2>Send your vehicle details.</h2>
          <div className="contact-methods">
            <a href={phoneHref}>
              <Phone size={17} aria-hidden="true" />
              {phoneDisplay}
            </a>
            <a href={`mailto:${email}`}>
              <Mail size={17} aria-hidden="true" />
              {email}
            </a>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp message
            </a>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="a4adf0c0-c67d-433e-a2b7-e3c8fa707d26" />
            <input type="hidden" name="subject" value="New Quote Request from PR REMAPS Website" />
            <input type="hidden" name="from_name" value="Programming & Coding Solutions" />

            <label>
              Name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label>
              Vehicle
              <input name="vehicle" type="text" autoComplete="off" />
            </label>
            <label className="wide">
              Fault codes or requirements
              <textarea name="requirements" rows="4" />
            </label>
            <label className="consent wide">
              <input type="checkbox" name="consent" required />
              <span>
                I consent to having Programming &amp; Coding Solutions store and process my details
                in accordance with the <a href="/privacy-policy.html">Privacy Policy</a>.
              </span>
            </label>
            <button className="wide" type="submit" disabled={submitting}>
              <span>{submitting ? 'Sending' : 'Request a Quote'}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
            <p className={`form-status wide ${status.type}`}>{status.message}</p>
          </form>

          <div className="form-rays" aria-hidden="true">
            <svg viewBox="0 0 299 152" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="url(#contactRaysGradient)"
                d="M149.5 152H133.42L9.53674e-07 4.70132e-06H149.5L299 4.70132e-06L165.58 152H149.5Z"
              />
              <defs>
                <linearGradient
                  id="contactRaysGradient"
                  x1="149.5"
                  y1="152"
                  x2="150.12"
                  y2="12.1981"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#DC323F" />
                  <stop offset="1" stopColor="#FF8089" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="form-emiter" aria-hidden="true">
            <svg viewBox="0 0 160 61" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#contactEmiterFilter0)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#2B2B2B"
                  d="M80 27.9997C121.974 27.9997 156 22.4032 156 15.4996L156 40.4998C156 47.4034 121.974 52.9998 80 52.9998C38.0265 52.9998 4.00028 47.4034 4 40.4998V40.4998V15.51C4.0342 22.4089 38.0474 27.9997 80 27.9997Z"
                />
              </g>
              <ellipse cx="80" cy="17.4236" rx="28.3956" ry="4.80773" fill="url(#contactEmiterRadial)" />
              <g filter="url(#contactEmiterFilter1)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#323232"
                  d="M80 28.0002C121.974 28.0002 156 22.4037 156 15.5001C156 8.59648 121.974 3 80 3C38.0264 3 4 8.59648 4 15.5001C4 22.4037 38.0264 28.0002 80 28.0002ZM80.0001 20.308C96.1438 20.308 109.231 18.1555 109.231 15.5002C109.231 12.845 96.1438 10.6925 80.0001 10.6925C63.8564 10.6925 50.7693 12.845 50.7693 15.5002C50.7693 18.1555 63.8564 20.308 80.0001 20.308Z"
                />
              </g>
              <g filter="url(#contactEmiterFilter2)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#A6444D"
                  d="M106.725 17.4505C108.336 16.8543 109.231 16.1943 109.231 15.4999C109.231 12.8446 96.1438 10.6921 80.0001 10.6921C63.8564 10.6921 50.7693 12.8446 50.7693 15.4999C50.7693 16.1943 51.6645 16.8543 53.2752 17.4504C53.275 17.4414 53.2748 17.4323 53.2748 17.4232C53.2748 14.768 65.2401 12.6155 80.0001 12.6155C94.7601 12.6155 106.725 14.768 106.725 17.4232C106.725 17.4323 106.725 17.4414 106.725 17.4505Z"
                />
              </g>
              <defs>
                <filter
                  id="contactEmiterFilter0"
                  x="0"
                  y="15.4996"
                  width="160"
                  height="45.5002"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.620833 0 0 0 0 0.620833 0 0 0 0 0.620833 0 0 0 0.25 0"
                  />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_38" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_38" result="shape" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="8" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                  <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1_38" />
                </filter>
                <filter
                  id="contactEmiterFilter1"
                  x="4"
                  y="3"
                  width="152"
                  height="25.0002"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect1_innerShadow_1_38" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="6.5" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_38" />
                </filter>
                <filter
                  id="contactEmiterFilter2"
                  x="40.7693"
                  y="0.692139"
                  width="78.4615"
                  height="26.7583"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_1_38" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="4" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.862745 0 0 0 0 0.196078 0 0 0 0 0.247059 0 0 0 1 0"
                  />
                  <feBlend mode="color-dodge" in2="BackgroundImageFix" result="effect1_dropShadow_1_38" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_38" result="shape" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect2_innerShadow_1_38" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.52 0" />
                  <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1_38" />
                </filter>
                <radialGradient
                  id="contactEmiterRadial"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(80 17.4236) rotate(90) scale(6.25004 36.9143)"
                >
                  <stop stopColor="#FF6B76" />
                  <stop offset="0.901042" stopColor="#7A0E18" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="animated-gradient footer-gradient" aria-hidden="true" />
      <div className="container footer-inner">
        <SectionTag>PR REMAPS</SectionTag>
        <h2>Curious about what we can fix together?</h2>
        <PrimaryButton href="#contact">Start a Diagnostic Request</PrimaryButton>

        <div className="footer-grid">
          <div className="footer-col">
            <a className="footer-brand" href="/" aria-label="PR REMAPS home">
              <img src="/assets/logo-120.png" alt="" width="38" height="38" />
              <span>PR REMAPS</span>
            </a>
            <p>
              Mobile AdBlue, SCR, NOx, EGR, ECU remapping and dealer-level diagnostics across
              London, Kent and Essex.
            </p>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <nav className="footer-links" aria-label="Footer navigation">
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <h3>Services</h3>
            <div className="footer-links">
              {services.map((service) => (
                <span key={service.title}>{service.title}</span>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <div className="footer-links">
              <a href={phoneHref}>{phoneDisplay}</a>
              <a href={`mailto:${email}`}>{email}</a>
              <span>London, Kent and Essex</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} Programming &amp; Coding Solutions. All rights
            reserved.
          </span>
          <a href="/privacy-policy.html">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export function App() {
  useRevealOnScroll()
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
        <BrandTicker />
        <Work />
        <About />
        <Process />
        <Services />
        <Reviews />
        <ContactAndFaq />
      </main>
      <Footer />
    </>
  )
}

export function PrivacyPage() {
  const policySections = useMemo(
    () => [
      [
        'What data we collect',
        'We collect the information you submit through the quote form, including your name, email address, phone number, vehicle make and model, and service requirements.',
      ],
      [
        'Why we collect it',
        'We use this data to respond to your request, understand your vehicle needs and provide accurate service guidance.',
      ],
      [
        'How we use your data',
        'Your data is used only to contact you about your request and provide our services. We do not sell your personal information.',
      ],
      [
        'Cookies',
        'We use essential cookies to ensure the site works correctly. Optional cookies are only enabled with your consent.',
      ],
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
            <p>How Programming &amp; Coding Solutions collects, uses and protects your data.</p>
          </div>
        </section>
        <section className="section">
          <div className="container policy-grid">
            {policySections.map(([title, body]) => (
              <article className="policy-card" key={title}>
                <h2>{title}</h2>
                <p>{body}</p>
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
