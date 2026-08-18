import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import portrait from '../assets/stato-portrait.webp'
import { profile } from '../data/experience'

function AboutSection() {
  const root = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const copy = root.current?.querySelector('.about-copy')
      const media = root.current?.querySelector('.about-media')
      const chips = root.current?.querySelectorAll('.about-chip')

      if (copy) {
        gsap.from(copy.children, {
          opacity: 0,
          y: 40,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: copy,
            start: 'top 82%',
            once: true,
          },
        })
      }

      if (media) {
        gsap.from(media, {
          opacity: 0,
          scale: 0.94,
          y: 32,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: media,
            start: 'top 85%',
            once: true,
          },
        })
      }

      if (chips?.length) {
        gsap.from(chips, {
          opacity: 0,
          y: 16,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chips[0],
            start: 'top 90%',
            once: true,
          },
        })
      }
    },
    { scope: root }
  )

  return (
    <section id="about" ref={root} className="section-padding bg-surface/80 relative overflow-hidden scroll-mt-24 border-y border-white/[0.06]">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          <div className="about-copy order-2 md:order-1 text-center md:text-left">
            <div className="inline-block mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium">Introduction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">
              <span className="text-text-primary">Hi. I&apos;m Avraham,</span>
              <span className="block text-primary mt-2">nice to meet you.</span>
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed mb-10 max-w-2xl md:max-w-none mx-auto md:mx-0">
              {profile.experienceNote}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8">
              {['Full Stack Development', 'System Architecture', 'Cloud Solutions', 'AI Integration'].map((label) => (
                <div
                  key={label}
                  className="about-chip px-4 py-2 bg-bg-primary/80 rounded-full border border-white/10 hover:border-primary/50 transition-colors duration-300"
                >
                  <span className="text-text-primary text-xs font-medium uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-media order-1 md:order-2 relative flex items-center justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-2xl transform rotate-6" />

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-hub bg-bg-primary/40 backdrop-blur-sm ring-1 ring-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

                <div className="relative aspect-[3/4] w-full min-h-[450px]">
                  <img
                    src={portrait}
                    alt="Avraham - Full Stack Developer"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: '50% 25%',
                      imageRendering: 'smooth',
                    }}
                    loading="eager"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/10 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full pointer-events-none" />
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl hidden lg:block" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl hidden lg:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
