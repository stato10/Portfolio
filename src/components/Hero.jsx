import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import DistortionHero from './ui/distortion-hero'
import heroPoster from '../assets/hero.png'

/**
 * Self-hosted hero media (no YouTube chrome). Same resolution rules as the old hero:
 *  - `VITE_HERO_VIDEO=https://…` full URL, or
 *  - `VITE_HERO_VIDEO=videos/my-file.mp4` under /public, or
 *  - default `public/videos/hero-video.mp4`.
 */
const DEFAULT_PUBLIC_VIDEO_REL = 'videos/hero-video.mp4'

function useHeroVideoUrl() {
    return useMemo(() => {
        const env = import.meta.env.VITE_HERO_VIDEO?.trim()
        if (env?.startsWith('http://') || env?.startsWith('https://')) return env
        const rel = (env || DEFAULT_PUBLIC_VIDEO_REL).replace(/^\/+/, '')
        const base = import.meta.env.BASE_URL || '/'
        return `${base}${rel}`
    }, [])
}

const ease = [0.16, 1, 0.3, 1]

function Hero() {
    const heroVideoUrl = useHeroVideoUrl()

    const scrollToProjects = () => {
        const projectsSection = document.getElementById('portfolio')
        if (projectsSection) {
            const navbarHeight = 100
            const top =
                projectsSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    return (
        <DistortionHero sectionId="hero" videoSrc={heroVideoUrl} imageSrc={heroPoster}>
            <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.15 }}
                    className="mb-6 inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.4em] text-text-muted"
                >
                    <span className="h-px w-8 bg-primary/70" />
                    Full Stack Developer
                    <span className="h-px w-8 bg-primary/70" />
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.1, ease, delay: 0.25 }}
                    className="font-display text-[15vw] leading-[0.82] tracking-tighter sm:text-[12vw] md:text-[9rem] lg:text-[11rem]"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >
                    <span className="block text-text-primary mix-blend-difference">AVRAHAM</span>
                    <span className="block text-primary">STATO</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.6 }}
                    className="mt-8 max-w-xl text-base font-sans text-text-muted sm:text-lg"
                    style={{ fontFamily: "'Antic', sans-serif" }}
                >
                    Crafting fast, human-centered experiences in code.
                </motion.p>
            </div>

            <motion.button
                type="button"
                onClick={scrollToProjects}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease, delay: 1 }}
                className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted transition-colors duration-300 hover:text-primary"
                aria-label="Scroll to work"
            >
                <ChevronDown className="h-7 w-7 animate-bounce" />
            </motion.button>
        </DistortionHero>
    )
}

export default Hero
