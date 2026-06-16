import { useEffect } from 'react'

export const phoneDisplay = '+44 7783 597186'
export const phoneHref = 'tel:+447783597186'
export const whatsappHref = 'https://wa.me/447783597186'
export const email = 'progandcod@gmail.com'
export const instagramHref = 'https://www.instagram.com/pr_remaps'

export const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
]

export function useRevealOnScroll() {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll('.reveal'))
    if (!revealElements.length) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('in-view'))
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

    revealElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export function PrimaryButton({ href, children, external = false }) {
  return (
    <a
      className="glow-button"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span>{children}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
      </svg>
    </a>
  )
}

export function SectionTag({ children }) {
  return (
    <span className="section-tag">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>
      </svg>
      {children}
    </span>
  )
}
