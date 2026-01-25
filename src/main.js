
// Mobile menu toggle
const docEl = document.documentElement
docEl?.classList.remove('no-js')

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle')
const nav = document.querySelector('.nav')
const navLinks = Array.from(document.querySelectorAll('.nav a'))
const navBackdrop = document.querySelector('.nav-backdrop')
const FALLBACK_ATTR = 'data-fallback-src'
const focusableSelectors = 'a[href], area[href], input:not([disabled]), button:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
const mobileMediaQuery = window.matchMedia('(max-width: 899px)')
const isFileProtocol = location.protocol === 'file:'
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let focusTrapHandler = null

function isMobileView() {
  return mobileMediaQuery.matches
}

function runAfterLoad(task) {
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(task, { timeout: 1200 })
    } else {
      setTimeout(task, 400)
    }
  })
}

// Provide fallback asset paths when browsing via simple file/Live Server setups.
function swapToFallback(img, fallbackSrc) {
  if (!fallbackSrc || img.dataset.fallbackApplied === 'true') return
  img.dataset.fallbackApplied = 'true'
  img.removeAttribute('srcset')
  img.removeAttribute('sizes')
  img.src = fallbackSrc
}

function applyImageFallbacks() {
  const selector = `img[${FALLBACK_ATTR}]`
  document.querySelectorAll(selector).forEach((img) => {
    const fallbackSrc = img.getAttribute(FALLBACK_ATTR)
    if (!fallbackSrc) return
    if (isFileProtocol) {
      swapToFallback(img, fallbackSrc)
      return
    }
    img.addEventListener('error', () => swapToFallback(img, fallbackSrc))
    if (img.complete && img.naturalWidth === 0) {
      swapToFallback(img, fallbackSrc)
    }
  })
}

applyImageFallbacks()

function enableFocusTrap() {
  if (!nav) return
  const focusables = Array.from(nav.querySelectorAll(focusableSelectors))
  if (!focusables.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  disableFocusTrap()
  focusTrapHandler = (event) => {
    if (event.key !== 'Tab') return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
  nav.addEventListener('keydown', focusTrapHandler)
}

function disableFocusTrap() {
  if (focusTrapHandler && nav) {
    nav.removeEventListener('keydown', focusTrapHandler)
    focusTrapHandler = null
  }
}

function openMobileMenu() {
  if (!mobileMenuToggle || !nav) return
  mobileMenuToggle.classList.add('active')
  mobileMenuToggle.setAttribute('aria-expanded', 'true')
  // reflect state on header for consistent sizing/glassmorphism
  const headerEl = document.querySelector('.site-header')
  if (headerEl) headerEl.classList.add('nav-open')
  nav.setAttribute('aria-hidden', 'false')
  if (navBackdrop) navBackdrop.classList.add('active')
  if (isMobileView()) {
    document.body.style.overflow = 'hidden'
  }

  // Stagger link animation: hide links then fade/slide them in one by one
  nav.classList.add('slide-link-hidden')
  nav.classList.remove('vanish-mode') // Remove vanish mode if present
  navLinks.forEach((link, i) => {
    link.classList.remove('show-link')
    const delay = i * 120 + 100
    link.style.transitionDelay = `${delay}ms`
    setTimeout(() => link.classList.add('show-link'), delay)
  })

  enableFocusTrap()
  // focus first link when opening
  setTimeout(() => navLinks[0]?.focus(), 250)
}

// Close with the exact same effect as opening, just in reverse order
function closeMobileMenuAnimated({ returnFocus = true } = {}) {
  if (!mobileMenuToggle || !nav) return

  const headerEl = document.querySelector('.site-header')
  const totalLinks = navLinks.length || 1
  
  // First, reset all transition delays to ensure clean start
  navLinks.forEach(link => {
    link.style.transitionDelay = ''
  })
  
  // Small delay to ensure reset takes effect
  requestAnimationFrame(() => {
    // Add vanish class to nav for vanish effect styling
    nav.classList.add('vanish-mode')
    
    // Reverse order: last link closes first, first link closes last
    // Use exact same timing formula as opening: i * 120 + 100
    navLinks.forEach((link, i) => {
      const indexFromEnd = totalLinks - 1 - i
      const delay = indexFromEnd * 120 + 100 // Same formula, reverse order
      link.style.transitionDelay = `${delay}ms`
      // Remove show-link to trigger vanish effect (fade out in place)
      setTimeout(() => {
        link.classList.remove('show-link')
      }, delay)
    })
  })

  // Wait for the first link (last to animate) to complete its animation
  // First link delay: (totalLinks - 1) * 120 + 100, plus 650ms transition duration
  const firstLinkDelay = (totalLinks - 1) * 120 + 100
  const totalDuration = firstLinkDelay + 650 + 20 // Small buffer for requestAnimationFrame

  setTimeout(() => {
    // Only close the nav panel after all links have finished vanishing
    nav.setAttribute('aria-hidden', 'true')
    nav.classList.remove('slide-link-hidden')
    nav.classList.remove('vanish-mode') // Remove vanish mode
    navLinks.forEach(link => {
      link.style.transitionDelay = ''
    })
    if (headerEl) headerEl.classList.remove('nav-open')
    if (navBackdrop) navBackdrop.classList.remove('active')
    mobileMenuToggle.classList.remove('active')
    mobileMenuToggle.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
    disableFocusTrap()
    if (returnFocus) mobileMenuToggle.focus()
  }, totalDuration)
}

// Toggle mobile menu
function toggleMobileMenu() {
  const isOpen = mobileMenuToggle?.classList.contains('active')
  if (isOpen) {
    closeMobileMenuAnimated()
  } else {
    openMobileMenu()
  }
}

// Close mobile menu
function closeMobileMenu() {
  closeMobileMenuAnimated()
}

// (nav tabs effect removed; simple links remain)

// Toggle menu on button click
mobileMenuToggle?.addEventListener('click', toggleMobileMenu)

// Note: keep the menu open until the user closes it explicitly

// Close mobile menu when clicking on backdrop
navBackdrop?.addEventListener('click', closeMobileMenu)

// Close on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenuToggle?.classList.contains('active')) {
    closeMobileMenu()
  }
})

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href')
    if (href.length > 1) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({behavior: 'smooth'})
      }
    }
  })
})

// Add scroll effect to header
let lastScroll = 0
const header = document.querySelector('.site-header')

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
  } else {
    header.style.boxShadow = 'none'
  }

  lastScroll = currentScroll
})

// Ensure page content is offset by header height when header is fixed/sticky
function updateHeaderOffset() {
  const hdr = document.querySelector('.site-header')
  if (!hdr) return
  const height = hdr.getBoundingClientRect().height
  document.documentElement.style.setProperty('--header-offset', `${height}px`)
}

// run on load and resize
window.addEventListener('load', updateHeaderOffset)
window.addEventListener('resize', () => {
  // small debounce
  clearTimeout(window.__headerOffsetTimer)
  window.__headerOffsetTimer = setTimeout(updateHeaderOffset, 120)
})

// IntersectionObserver for reveal animations
runAfterLoad(() => {
  if (prefersReducedMotion.matches) return
  const revealElements = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window && revealElements.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          // Trigger stat number animations if present
          const stats = entry.target.querySelectorAll && entry.target.querySelectorAll('.stat-number')
          if (stats && stats.length) {
            stats.forEach(el => {
              if (!el.dataset.animated) {
                animateNumber(el)
                el.dataset.animated = 'true'
              }
            })
          }
          // Optionally unobserve to avoid repeated triggers
          io.unobserve(entry.target)
        }
      })
    }, {root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12})

    revealElements.forEach(el => io.observe(el))
  }
})

// Animate numeric counter for elements like "500+", "98%"
function animateNumber(el, duration = 2000) {
  const raw = el.textContent.trim()
  const m = raw.match(/(\d+)(.*)/)
  if (!m) return
  const target = parseInt(m[1].replace(/,/g, ''), 10)
  const suffix = m[2] || ''
  const start = 0
  const startTime = performance.now()

  function tick(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const value = Math.floor(progress * (target - start) + start)
    el.textContent = value.toString() + suffix
    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      el.textContent = target.toString() + suffix
    }
  }

  requestAnimationFrame(tick)
}

// Services Expandable Button
function initServicesExpandable() {
  const servicesExpandable = document.querySelector('.services-expandable')
  const servicesTrigger = document.querySelector('.services-trigger')
  const serviceCards = servicesExpandable?.querySelectorAll('.service-card') ?? []
  let collapseTimer = null
  let expandTimer = null
  let returnTimer = null

  if (!servicesExpandable || !servicesTrigger) return

  servicesTrigger.addEventListener('click', () => {
    const isExpanded = servicesExpandable.classList.contains('expanded')
    const isCollapsing = servicesExpandable.classList.contains('collapsing')
    const isFilling = servicesTrigger.classList.contains('filling')

    if (isExpanded && !isCollapsing) {
      // Collapse with the same bubble stagger effect
      servicesExpandable.classList.add('collapsing')
      servicesTrigger.classList.remove('filling')
      servicesTrigger.classList.add('returning')
      if (returnTimer) clearTimeout(returnTimer)
      if (expandTimer) clearTimeout(expandTimer)

      if (collapseTimer) clearTimeout(collapseTimer)
      const maxDelay = serviceCards.length ? 500 : 0
      collapseTimer = setTimeout(() => {
        servicesExpandable.classList.remove('expanded')
        servicesExpandable.classList.remove('collapsing')
        servicesTrigger.classList.remove('returning')
        servicesTrigger.setAttribute('aria-expanded', 'false')
      }, 600 + maxDelay + 100)
    } else if (!isExpanded && !isCollapsing && !isFilling) {
      // Expand
      if (collapseTimer) clearTimeout(collapseTimer)
      servicesExpandable.classList.remove('collapsing')
      servicesTrigger.classList.add('filling')
      servicesTrigger.setAttribute('aria-expanded', 'false')
      if (expandTimer) clearTimeout(expandTimer)
      expandTimer = setTimeout(() => {
        servicesTrigger.classList.remove('filling')
        servicesExpandable.classList.add('expanded')
        servicesTrigger.setAttribute('aria-expanded', 'true')
      }, 1100)
    }
  })
}

runAfterLoad(initServicesExpandable)

// Cookie banner
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner')
  if (!banner) return
  const acceptBtn = banner.querySelector('.cookie-accept')
  const rejectBtn = banner.querySelector('.cookie-reject')
  const settingsBtn = banner.querySelector('.cookie-settings')
  const settingsPanel = banner.querySelector('.cookie-banner__settings')
  const analyticsToggle = banner.querySelector('input[name="analytics"]')
  const storageKey = 'cookie-consent-v2'

  const safeGet = () => {
    try { return window.localStorage.getItem(storageKey) } catch { return null }
  }
  const safeSet = (value) => {
    try { window.localStorage.setItem(storageKey, value) } catch {}
  }

  const existing = safeGet()
  if (!existing) {
    banner.classList.add('is-visible')
  }

  function closeBanner() {
    banner.classList.remove('is-visible')
  }

  acceptBtn?.addEventListener('click', () => {
    const analytics = analyticsToggle?.checked ? 'analytics' : 'essential'
    safeSet(`accepted:${analytics}`)
    closeBanner()
  })

  rejectBtn?.addEventListener('click', () => {
    safeSet('rejected:essential')
    closeBanner()
  })

  settingsBtn?.addEventListener('click', () => {
    const isOpen = settingsBtn.getAttribute('aria-expanded') === 'true'
    settingsBtn.setAttribute('aria-expanded', String(!isOpen))
    if (settingsPanel) {
      settingsPanel.hidden = isOpen
    }
  })
}

runAfterLoad(initCookieBanner)

// Contact form via Web3Forms
function initContactForm() {
  const form = document.querySelector('.contact-form')
  if (!form) return
  const status = form.querySelector('.contact-form-status')
  const submitButton = form.querySelector('button[type="submit"]')

  function setStatus(message, isError = false) {
    if (!status) return
    status.textContent = message
    status.style.color = isError ? '#e74c3c' : '#27ae60'
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const formData = new FormData(form)

    try {
      if (submitButton) submitButton.disabled = true
      setStatus('Sending your message...')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setStatus('Thanks! Your message has been sent.')
        form.reset()
      } else {
        setStatus('Sorry, the message failed to send. Please try again.', true)
      }
    } catch (error) {
      setStatus('Sorry, the message failed to send. Please try again.', true)
      if (console && console.error) {
        console.error('Form submission error:', error)
      }
    } finally {
      if (submitButton) submitButton.disabled = false
    }
  })
}

runAfterLoad(initContactForm)

// 3D Carousel for "What We Do" section
function init3DCarousel() {
  const carousel = document.getElementById('services-carousel')
  if (!carousel) return

  const cards = carousel.querySelectorAll('.carousel-card')
  const dots = document.querySelectorAll('.carousel-dot')
  const totalCards = cards.length
  let currentIndex = 0
  let autoRotateInterval = null
  let isPaused = false

  // Set initial positions
  function updateCarousel() {
    cards.forEach((card, i) => {
      // Calculate position relative to current index
      let position = (i - currentIndex + totalCards) % totalCards
      card.setAttribute('data-position', position)
    })

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex)
    })
  }

  // Rotate to next card
  function rotateNext() {
    currentIndex = (currentIndex + 1) % totalCards
    updateCarousel()
  }

  // Rotate to previous card
  function rotatePrev() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards
    updateCarousel()
  }

  // Go to specific index
  function goToIndex(index) {
    currentIndex = index
    updateCarousel()
  }

  // Start auto-rotation
  function startAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval)
    autoRotateInterval = setInterval(() => {
      if (!isPaused) {
        rotateNext()
      }
    }, 3500) // Rotate every 3.5 seconds
  }

  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval)
      autoRotateInterval = null
    }
  }

  // Pause auto-rotation on hover
  const container = carousel.closest('.carousel-3d-container')
  if (container) {
    container.addEventListener('mouseenter', () => {
      isPaused = true
    })
    container.addEventListener('mouseleave', () => {
      isPaused = false
    })
  }

  // Click on cards to rotate
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      goToIndex(i)
    })
  })

  // Click on dots to navigate
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToIndex(i)
    })
  })

  // Touch/swipe support
  let touchStartX = 0
  let touchEndX = 0

  if (container) {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX
      isPaused = true
    }, { passive: true })

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
      setTimeout(() => { isPaused = false }, 1000)
    }, { passive: true })
  }

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (diff > swipeThreshold) {
      rotateNext()
    } else if (diff < -swipeThreshold) {
      rotatePrev()
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only if carousel is in viewport
    const rect = carousel.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0

    if (isVisible) {
      if (e.key === 'ArrowRight') {
        rotateNext()
      } else if (e.key === 'ArrowLeft') {
        rotatePrev()
      }
    }
  })

  // Initialize
  updateCarousel()
  if (!prefersReducedMotion.matches && container && 'IntersectionObserver' in window) {
    const startObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoRotate()
        } else {
          stopAutoRotate()
        }
      })
    }, { root: null, threshold: 0.2 })

    startObserver.observe(container)
  } else if (!prefersReducedMotion.matches) {
    startAutoRotate()
  }
}

function init3DCarouselOnView() {
  const container = document.querySelector('.carousel-3d-container')
  if (!container || !('IntersectionObserver' in window)) {
    init3DCarousel()
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        init3DCarousel()
        observer.disconnect()
      }
    })
  }, { root: null, threshold: 0.15 })

  observer.observe(container)
}

runAfterLoad(init3DCarouselOnView)
