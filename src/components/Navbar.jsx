import { useState, useEffect, useRef, useLayoutEffect, useCallback, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Navigation } from 'lucide-react'
import gsap from 'gsap'
import NavbarMobileMenu from './NavbarMobileMenu'
import { PRIMARY_NAV_LINKS } from '../constants/primaryNavLinks'
import { LenisRefContext } from './SmoothScroll'
import { cn } from '@/lib/utils'
import {
    portfolioNavContainerVariants,
    portfolioCollapsedIconVariants,
    portfolioItemVariants,
    usePortfolioNavScrollExpanded,
    useMediaQuery,
} from '@/components/ui/navigation-menu'

/** Fixed header offset passed to Lenis.scrollTo (negative raises target). */
const NAV_SCROLL_OFFSET = -96

/**
 * Mobile menu matches GSAP demo pattern: timeline .clear() + rebuild, different enter (fromTo) vs exit (to).
 * @see https://codepen.io/GreenSock/pen/raMQBVQ
 */

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const lenisRef = useContext(LenisRefContext)

    /** Latest scrollToHash for delayed post-menu-close nudges (after body unlock + layout). */
    const scrollToHashRef = useRef(() => {})

    const scrollToHero = useCallback(() => {
        const lenis = lenisRef?.current
        const el = document.getElementById('hero')
        try {
            lenis?.resize?.()
        } catch (_) {
            /* older Lenis */
        }
        if (lenis && typeof lenis.scrollTo === 'function') {
            if (el) {
                lenis.scrollTo(el, { offset: NAV_SCROLL_OFFSET })
            } else {
                lenis.scrollTo(0, { immediate: true })
            }
            return
        }
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY + NAV_SCROLL_OFFSET
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [lenisRef])

    const scrollToHash = useCallback(
        (hash) => {
            const id = typeof hash === 'string' ? hash.replace(/^#/, '').trim() : ''
            if (!id) return
            const element = document.getElementById(id)
            const lenis = lenisRef?.current
            try {
                lenis?.resize?.()
            } catch (_) {
                /* optional */
            }
            if (lenis && typeof lenis.scrollTo === 'function') {
                const target = element ?? `#${id}`
                lenis.scrollTo(target, { offset: NAV_SCROLL_OFFSET })
                return
            }
            if (element) {
                const top = element.getBoundingClientRect().top + window.pageYOffset + NAV_SCROLL_OFFSET
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
            }
        },
        [lenisRef]
    )

    scrollToHashRef.current = scrollToHash

    const isSmallScreen = useMediaQuery('(max-width: 767px)')
    const { isExpanded: desktopNavExpanded, setExpanded: setDesktopNavExpanded, handleCollapsedChromeClick } =
        usePortfolioNavScrollExpanded()

    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('')

    const menuTl = useRef(gsap.timeline())

    const overlayRef = useRef(null)
    const barTopRef = useRef(null)
    const barBotRef = useRef(null)
    const menuBtnRef = useRef(null)
    const toggleMenuRef = useRef(null)
    /** Keeps latest menuOpen for click handlers without stale closures. */
    const menuOpenRef = useRef(false)
    /** Desktop md+: full bar vs collapsed scroll chip (AnimatedNav-style); mobile never collapses. */
    const showNavChrome = isSmallScreen || desktopNavExpanded
    /** Queued taps while drawer is closing — flushed after menuOpen flips false (same tick as GSAP `.call`). */
    const pendingAfterMobileMenuCloseRef = useRef(null)
    /** Killed when reopening drawer so orphaned scroll jobs don’t run. */
    const pendingFlushTweenRef = useRef(null)

    menuOpenRef.current = menuOpen

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setScrolled(currentScrollY > 24)

            const sections = ['portfolio', 'about', 'contact']
            let current = ''

            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 140 && rect.bottom >= 140) {
                        current = sectionId
                    }
                }
            })

            if (currentScrollY < 120) {
                current = 'home'
            }

            setActiveSection(current)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    /** Mobile menu: Safari/iOS fixes broken `fixed` overlays when only `overflow: hidden` is used on body. */
    useEffect(() => {
        const body = document.body
        const html = document.documentElement

        let savedScrollY = 0

        if (!menuOpen) {
            return
        }

        const mq = typeof window.matchMedia !== 'undefined' ? window.matchMedia('(max-width: 767px)') : null
        const isMobileViewport = mq ? mq.matches : true

        if (isMobileViewport) {
            savedScrollY = window.scrollY || html.scrollTop || 0
            html.style.overflow = 'hidden'
            body.style.overflow = 'hidden'
            body.style.position = 'fixed'
            body.style.top = `-${savedScrollY}px`
            body.style.left = '0'
            body.style.right = '0'
            body.style.width = '100%'
            return () => {
                body.style.position = ''
                body.style.top = ''
                body.style.left = ''
                body.style.right = ''
                body.style.width = ''
                body.style.overflow = ''
                html.style.overflow = ''
                window.scrollTo(0, savedScrollY)
            }
        }

        body.style.overflow = 'hidden'
        return () => {
            body.style.overflow = ''
        }
    }, [menuOpen])

    /** If the viewport crosses `md` while the drawer is open, close it so body scroll lock / hidden overlay don’t desync. */
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)')
        const onChange = () => {
            if (!mq.matches && menuOpen) {
                toggleMenuRef.current?.(false)
            }
        }
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [menuOpen])

    useEffect(() => {
        return () => {
            menuTl.current.kill()
            menuTl.current = gsap.timeline()
            const body = document.body
            const html = document.documentElement
            body.style.position = ''
            body.style.top = ''
            body.style.left = ''
            body.style.right = ''
            body.style.width = ''
            body.style.overflow = ''
            html.style.overflow = ''
        }
    }, [])

    /** When `/` carries a hash, scroll to section (works after SPA nav from `/blog`, etc.). */
    useEffect(() => {
        if (location.pathname !== '/') return
        const h = location.hash
        if (!h || h === '#') return
        const t = window.setTimeout(() => scrollToHash(h), 100)
        return () => window.clearTimeout(t)
    }, [location.pathname, location.hash, scrollToHash])

    const goToPrimarySection = useCallback(
        (hash) => {
            const normalized = hash.startsWith('#') ? hash : `#${hash}`
            if (location.pathname === '/' && location.hash === normalized) {
                scrollToHash(normalized)
                return
            }
            navigate({ pathname: '/', hash: normalized.slice(1) })
        },
        [location.pathname, location.hash, navigate, scrollToHash]
    )

    const linkIsActive = (link) => {
        if (link.path === '/') {
            if (location.pathname !== '/') return false
            const hasHash = Boolean(location.hash && location.hash.replace('#', ''))
            if (hasHash) return false
            return activeSection === 'home'
        }
        if (location.pathname !== '/') return false
        if (link.hash) {
            const idFromHash = link.hash.slice(1)
            return location.hash === link.hash || activeSection === idFromHash || activeSection === link.section
        }
        return false
    }

    /** ─── GSAP enter / exit (matches CodePen raMQBVQ structure) ─── */

    const openMobileMenu = useCallback(() => {
        const nav = overlayRef.current
        const topLine = barTopRef.current
        const botLine = barBotRef.current
        /** Overlay must always open — hamburger refs are SVG <line>s; omitting icons must not silently fail on WebKit/mobile. */
        if (!nav) return

        const bg = nav.querySelector('.nav-bg')
        const panels = nav.querySelectorAll('.nav-panel')
        const items = nav.querySelectorAll('.nav-item')
        const loginEl = nav.querySelector('.nav-login')

        menuTl.current.clear()

        const tl = menuTl.current.set(nav, { visibility: 'visible', pointerEvents: 'auto' })
        if (bg) {
            tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
        }

        if (panels.length) {
            tl.fromTo(
                panels,
                { xPercent: 101, y: 0, rotation: 0 },
                { xPercent: 0, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.2 },
                0
            )
        }
        if (items.length) {
            tl.fromTo(
                items,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out', stagger: 0.03 },
                0.1
            )
        }
        if (topLine && botLine) {
            tl.fromTo(
                topLine,
                { stroke: 'currentColor', attr: { x1: 4, y1: 7, x2: 18, y2: 7 } },
                {
                    stroke: '#0e100f',
                    attr: { x1: 6, y1: 6, x2: 16, y2: 16 },
                    duration: 0.35,
                    ease: 'back.out(1.4)',
                },
                0.06
            ).fromTo(
                botLine,
                { stroke: 'currentColor', attr: { x1: 4, y1: 13, x2: 18, y2: 13 } },
                {
                    stroke: '#0e100f',
                    attr: { x1: 16, y1: 6, x2: 6, y2: 16 },
                    duration: 0.35,
                    ease: 'back.out(1.4)',
                },
                0.06
            )
        }
        if (loginEl) {
            tl.fromTo(loginEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 0.4)
        }
    }, [])

    const closeMobileMenu = useCallback(() => {
        const nav = overlayRef.current
        const topLine = barTopRef.current
        const botLine = barBotRef.current
        if (!nav) return

        const bg = nav.querySelector('.nav-bg')
        const panels = nav.querySelectorAll('.nav-panel')

        menuTl.current.clear()

        const tl = menuTl.current
        const hasBars = Boolean(topLine && botLine)

        if (hasBars) {
            tl.to([topLine, botLine], { stroke: 'currentColor', duration: 0.2 })
                .to(
                    topLine,
                    {
                        attr: { x1: 4, y1: 7, x2: 18, y2: 7 },
                        duration: 0.2,
                        ease: 'power3.in',
                    },
                    '<'
                )
                .to(
                    botLine,
                    {
                        attr: { x1: 4, y1: 13, x2: 18, y2: 13 },
                        duration: 0.2,
                        ease: 'power3.in',
                    },
                    '<'
                )
        }

        const panelTweenPos = hasBars ? '<' : undefined
        tl.to(
            panels,
            {
                y: '160vh',
                rotation: () => gsap.utils.random(-15, 15),
                duration: 1,
                ease: 'power3.in',
                stagger: { each: 0.02, from: 'end' },
            },
            panelTweenPos
        )

        if (bg) {
            tl.to(bg, { opacity: 0, duration: 0.35, ease: 'power2.in' }, '<0.1')
        }

        tl.set(nav, { visibility: 'hidden', pointerEvents: 'none' })
            .set(panels, { y: 0, rotation: 0, xPercent: 101 })
            .set(nav.querySelectorAll('.nav-item'), { opacity: 0, x: -20 })
            .set(nav.querySelector('.nav-login'), { opacity: 0, y: 8 })
            .call(() => {
                setMenuOpen(false)
            })
            .call(() => {
                pendingFlushTweenRef.current?.kill()
                pendingFlushTweenRef.current = gsap.delayedCall(0.16, () => {
                    pendingFlushTweenRef.current = null
                    const queued = pendingAfterMobileMenuCloseRef.current
                    if (!queued) return
                    pendingAfterMobileMenuCloseRef.current = null
                    const len = lenisRef?.current
                    try {
                        len?.resize?.()
                    } catch (_) {
                        /* optional */
                    }
                    queued()
                    try {
                        len?.resize?.()
                    } catch (_) {
                        /* optional */
                    }
                    window.requestAnimationFrame(() => {
                        window.requestAnimationFrame(() => {
                            scrollToHashRef.current(window.location.hash)
                            gsap.delayedCall(0.12, () => scrollToHashRef.current(window.location.hash))
                        })
                    })
                })
            })
    }, [lenisRef])

    const toggleMobileMenu = useCallback(
        (forced) => {
            const next = typeof forced === 'boolean' ? forced : !menuOpen
            if (next === menuOpen) return

            menuTl.current.clear()

            if (next) {
                pendingFlushTweenRef.current?.kill()
                pendingFlushTweenRef.current = null
                pendingAfterMobileMenuCloseRef.current = null
                setMenuOpen(true)
                requestAnimationFrame(() => openMobileMenu())
            } else {
                closeMobileMenu()
            }

            const btn = menuBtnRef.current
            if (btn) {
                btn.setAttribute('aria-expanded', String(next))
                btn.setAttribute('aria-label', next ? 'Close menu' : 'Open menu')
            }

            const root = overlayRef.current
            if (root) {
                root.querySelectorAll('a, button').forEach((el) => {
                    if (el.closest('.nav-bg')) return
                    el.setAttribute('tabindex', next ? '0' : '-1')
                })
            }
        },
        [menuOpen, openMobileMenu, closeMobileMenu]
    )

    toggleMenuRef.current = toggleMobileMenu

    /**
     * While the mobile drawer is open, document.body stays `position: fixed` until GSAP fires
     * `setMenuOpen(false)`. Navigating / scrolling in that window is ignored on phones — defer until closed.
     */
    const deferAfterMobileOverlayClose = useCallback((action) => {
        if (typeof action !== 'function') return
        if (!menuOpenRef.current) {
            action()
            return
        }
        pendingAfterMobileMenuCloseRef.current = action
        toggleMenuRef.current?.(false)
    }, [])

    const handlePrimaryHomeClick = useCallback(
        (e) => {
            e.preventDefault()
            deferAfterMobileOverlayClose(() => {
                if (location.pathname === '/') {
                    if (location.hash) {
                        navigate('/', { replace: true })
                    }
                    scrollToHero()
                    return
                }
                navigate('/')
                window.setTimeout(() => scrollToHero(), 250)
            })
        },
        [deferAfterMobileOverlayClose, location.pathname, location.hash, navigate, scrollToHero]
    )

    useLayoutEffect(() => {
        const nav = overlayRef.current
        if (!nav) return

        gsap.set(nav, { visibility: 'hidden', pointerEvents: 'none' })
        const bg = nav.querySelector('.nav-bg')
        if (bg) gsap.set(bg, { opacity: 0 })
        gsap.set(nav.querySelectorAll('.nav-panel'), { xPercent: 101, y: 0, rotation: 0 })
        gsap.set(nav.querySelectorAll('.nav-item'), { opacity: 0, x: -20 })
        const login = nav.querySelector('.nav-login')
        if (login) gsap.set(login, { opacity: 0, y: 8 })
    }, [])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && menuOpen) {
                toggleMobileMenu(false)
                menuBtnRef.current?.focus()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [menuOpen, toggleMobileMenu])

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-[100] flex justify-center pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] md:px-6 md:pt-5 pointer-events-auto"
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.nav
                    layout
                    variants={portfolioNavContainerVariants}
                    animate={showNavChrome ? 'expanded' : 'collapsed'}
                    initial={false}
                    onClick={() => {
                        if (!showNavChrome && !isSmallScreen) {
                            setDesktopNavExpanded(true)
                        }
                    }}
                    whileHover={!isSmallScreen && !showNavChrome ? { scale: 1.06 } : undefined}
                    whileTap={!isSmallScreen && !showNavChrome ? { scale: 0.96 } : undefined}
                    tabIndex={!showNavChrome && !isSmallScreen ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (!isSmallScreen && !showNavChrome && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault()
                            setDesktopNavExpanded(true)
                        }
                    }}
                    aria-expanded={isSmallScreen ? undefined : desktopNavExpanded}
                    aria-label={!showNavChrome && !isSmallScreen ? 'Expand navigation' : undefined}
                    className={cn(
                        'pointer-events-auto flex w-full max-w-[1200px] flex-row items-center justify-between gap-4 px-4 py-3',
                        'rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 ease-out',
                        showNavChrome
                            ? 'md:grid md:max-w-[min(1180px,calc(100%-1.5rem))] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-6 md:rounded-full md:border md:px-3 md:py-2.5 lg:px-4'
                            : 'cursor-pointer md:h-14 md:w-14 md:min-h-14 md:min-w-14 md:max-w-14 md:flex-none md:flex-row md:!grid-cols-none md:justify-center md:gap-0 md:overflow-hidden md:rounded-full md:border md:!px-0 md:!py-0',
                        scrolled || menuOpen
                            ? 'border-white/[0.1] bg-surface/85 shadow-hub backdrop-blur-xl max-md:shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:border-white/[0.1] md:bg-gradient-to-b md:from-white/[0.09] md:via-surface/80 md:to-surface/90 md:shadow-[0_12px_48px_-16px_rgba(0,0,0,0.65),0_0_0_1px_rgba(10,228,72,0.07)] md:backdrop-blur-2xl'
                            : 'border-white/[0.1] bg-surface/[0.92] shadow-hub backdrop-blur-xl max-md:shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:border-white/[0.07] md:bg-gradient-to-b md:from-white/[0.05] md:via-bg-primary/40 md:to-bg-primary/55 md:shadow-[0_8px_40px_-20px_rgba(0,0,0,0.55)] md:backdrop-blur-xl'
                    )}
                >
                    {showNavChrome ? (
                        <>
                            <motion.div
                                variants={portfolioItemVariants}
                                className="flex min-w-0 items-center gap-3 md:justify-self-start md:gap-3.5"
                            >
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        handleCollapsedChromeClick(e)
                                        handlePrimaryHomeClick(e)
                                    }}
                                    className="group flex shrink-0 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded-xl"
                                >
                                    <Navigation
                                        className="hidden h-5 w-5 shrink-0 text-primary/65 md:block"
                                        aria-hidden
                                    />
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/[0.08] text-xs font-display text-primary shadow-[0_0_20px_-8px_rgba(10,228,72,0.35)] transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/[0.14] md:h-10 md:w-10 md:rounded-xl">
                                        AS
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-display text-xs tracking-wider text-text-primary transition-colors group-hover:text-primary sm:text-sm md:text-[15px] md:tracking-[0.12em]">
                                            STATO
                                        </span>
                                        <span className="hidden truncate text-[10px] font-sans uppercase tracking-[0.2em] text-text-muted sm:block md:text-[10px] md:tracking-[0.24em]">
                                            Full Stack
                                        </span>
                                    </span>
                                </Link>
                            </motion.div>

                            <motion.ul
                                variants={portfolioItemVariants}
                                className="hidden list-none md:flex md:justify-self-center md:items-center md:gap-0.5 md:rounded-full md:border md:border-white/[0.08] md:bg-black/35 md:p-1 md:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_32px_-12px_rgba(0,0,0,0.5)] md:backdrop-blur-xl"
                                aria-label="Primary sections"
                            >
                                {PRIMARY_NAV_LINKS.map((link) => {
                                    const active = linkIsActive(link)
                                    const deskLink =
                                        'relative block overflow-hidden rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 md:px-5 md:py-2 lg:tracking-[0.26em]'

                                    const label = (
                                        <span className="relative z-10 inline-block">{link.name}</span>
                                    )

                                    return (
                                        <li key={link.name} className="relative">
                                            {link.path === '/' ? (
                                                <Link
                                                    to="/"
                                                    onClick={(e) => {
                                                        handleCollapsedChromeClick(e)
                                                        handlePrimaryHomeClick(e)
                                                    }}
                                                    className={`${deskLink} ${
                                                        active ? 'text-primary' : 'text-zinc-500 hover:text-zinc-100'
                                                    }`}
                                                >
                                                    {active && (
                                                        <motion.span
                                                            layoutId="navbar-dock-active"
                                                            className="absolute inset-0 z-0 rounded-full bg-gradient-to-b from-primary/30 to-primary/[0.08] ring-1 ring-primary/40 shadow-[0_0_32px_-10px_rgba(10,228,72,0.5)]"
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 460,
                                                                damping: 34,
                                                            }}
                                                        />
                                                    )}
                                                    {label}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={{
                                                        pathname: '/',
                                                        hash: link.hash.slice(1),
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleCollapsedChromeClick(e)
                                                        deferAfterMobileOverlayClose(() =>
                                                            goToPrimarySection(link.hash)
                                                        )
                                                    }}
                                                    className={`${deskLink} ${
                                                        active ? 'text-primary' : 'text-zinc-500 hover:text-zinc-100'
                                                    }`}
                                                >
                                                    {active && (
                                                        <motion.span
                                                            layoutId="navbar-dock-active"
                                                            className="absolute inset-0 z-0 rounded-full bg-gradient-to-b from-primary/30 to-primary/[0.08] ring-1 ring-primary/40 shadow-[0_0_32px_-10px_rgba(10,228,72,0.5)]"
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 460,
                                                                damping: 34,
                                                            }}
                                                        />
                                                    )}
                                                    {label}
                                                </Link>
                                            )}
                                        </li>
                                    )
                                })}
                            </motion.ul>

                            <motion.div
                                variants={portfolioItemVariants}
                                className="flex shrink-0 items-center justify-end gap-2 md:justify-self-end md:gap-3"
                            >
                                <button
                                    ref={menuBtnRef}
                                    id="portfolio-menu-toggle"
                                    type="button"
                                    onClick={() => toggleMobileMenu()}
                                    className="relative flex h-11 min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg border border-white/10 text-text-primary transition-colors hover:border-primary/35 hover:bg-primary/[0.06] hover:text-primary md:hidden"
                                    aria-expanded={menuOpen}
                                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                    aria-controls="portfolio-mobile-nav"
                                >
                                    <span className="sr-only">Menu</span>
                                    <svg
                                        className="bar block h-5 w-5 text-text-primary"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <line
                                            ref={barTopRef}
                                            className="bar-top"
                                            x1="4"
                                            y1="7"
                                            x2="18"
                                            y2="7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <line
                                            ref={barBotRef}
                                            className="bar-bot"
                                            x1="4"
                                            y1="13"
                                            x2="18"
                                            y2="13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </motion.div>
                        </>
                    ) : (
                        <div className="relative flex h-full min-h-[2.75rem] w-full items-center justify-center md:min-h-0 md:min-w-0">
                            <motion.div
                                variants={portfolioCollapsedIconVariants}
                                className="flex items-center justify-center text-primary"
                            >
                                <Menu className="h-6 w-6" aria-hidden />
                            </motion.div>
                        </div>
                    )}
                </motion.nav>
            </motion.header>

            {/* GSAP timeline targets `.nav-*` nodes inside NavbarMobileMenu (hidden md+). */}
            <NavbarMobileMenu
                overlayRef={overlayRef}
                menuOpen={menuOpen}
                onBackdropClose={() => toggleMobileMenu(false)}
                linkPanels={PRIMARY_NAV_LINKS.map((link, index) => {
                    const active = linkIsActive(link)
                    const idle = 'nav-link text-bg-primary hover:opacity-80'
                    const activeRow = `${idle} opacity-90`
                    const isLast = index === PRIMARY_NAV_LINKS.length - 1
                    return (
                        <section
                            key={link.name}
                            className="nav-panel nav-top nav-border relative w-full shrink-0 overflow-hidden rounded-[10px] border-2 border-white/80 bg-[#fffce1] text-bg-primary shadow-none"
                        >
                            <ul className="nav-list list-none px-4 py-2 sm:px-5 sm:py-3">
                                <li className="nav-item overflow-hidden">
                                    {link.path === '/' ? (
                                        <Link
                                            to="/"
                                            tabIndex={-1}
                                            onClick={handlePrimaryHomeClick}
                                            className={`block py-3 text-lg font-semibold uppercase tracking-tight sm:py-3.5 sm:text-xl ${active ? activeRow : idle}`}
                                        >
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <Link
                                            to={{
                                                pathname: '/',
                                                hash: link.hash.slice(1),
                                            }}
                                            tabIndex={-1}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                deferAfterMobileOverlayClose(() =>
                                                    goToPrimarySection(link.hash)
                                                )
                                            }}
                                            className={`block py-3 text-lg font-semibold uppercase tracking-tight sm:py-3.5 sm:text-xl ${active ? activeRow : idle}`}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            </ul>
                            {isLast && (
                                <p className="nav-login border-t border-bg-primary/[0.12] px-4 pb-3 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bg-primary/50 sm:px-5 sm:text-[11px]">
                                    Full Stack Developer · Portfolio
                                </p>
                            )}
                        </section>
                    )
                })}
                middleExtras={
                    <button
                        type="button"
                        tabIndex={-1}
                        className="rounded-full border border-black/25 bg-black/10 px-4 py-2 font-mono text-[11px]"
                        onClick={() => {
                            deferAfterMobileOverlayClose(() => goToPrimarySection('#portfolio'))
                        }}
                    >
                        View projects
                    </button>
                }
                bottomExtras={
                    <li>
                        <a
                            href="https://github.com/stato10"
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={-1}
                            className="hover:text-primary"
                            onClick={() => toggleMenuRef.current?.(false)}
                        >
                            github.com/stato10
                        </a>
                    </li>
                }
            />
        </>
    )
}

export default Navbar
