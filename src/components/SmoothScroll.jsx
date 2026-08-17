import { createContext, useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Ref to the active Lenis instance so nav / in-app links can call `scrollTo` (window.scrollTo does not move Lenis). */
// eslint-disable-next-line react-refresh/only-export-components
export const LenisRefContext = createContext(null)

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        lenis.on('scroll', ScrollTrigger.update)

        const tickerCb = (time) => {
            lenis.raf(time * 1000)
        }
        gsap.ticker.add(tickerCb)
        gsap.ticker.lagSmoothing(0)

        ScrollTrigger.refresh()

        return () => {
            gsap.ticker.remove(tickerCb)
            lenisRef.current = null
            lenis.destroy()
            ScrollTrigger.refresh()
        }
    }, [])

    return <LenisRefContext.Provider value={lenisRef}>{children}</LenisRefContext.Provider>
}
