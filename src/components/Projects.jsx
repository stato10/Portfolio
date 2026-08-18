import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useScrubbedBentoGallery } from '../hooks/useScrubbedBentoGallery'
import perfectDressHero from '../assets/perfect-dress-hero.png'

const projects = [
  {
    id: 2,
    title: 'INTERVIEW AVATAR AI',
    category: 'AI Application',
    year: '2026',
    description: 'An end-to-end AI recruitment platform with real-time voice and vision interaction, CV context injection and live non-verbal feedback.',
    img: 'https://res.cloudinary.com/dpz2lh8hu/image/upload/v1769536830/Screenshot_2026-01-27_195603_jab8yn.png',
    link: 'https://github.com/stato10/interviewAvatar',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Python', 'FastAPI', 'LiveKit', 'OpenAI GPT-4o'],
  },
  {
    id: 7,
    title: 'AI RECRUITER',
    category: 'Automation',
    year: '2024',
    description: 'An intelligent chatbot that automates the candidate screening process. It conducts initial interviews, evaluates responses for job fit, and autonomously handles communication—sending approval emails for the next stage or polite rejection notices based on real-time decisions.',
    img: 'https://res.cloudinary.com/dpz2lh8hu/image/upload/v1765828845/pexels-theshantanukr-16474960_fdtvua.jpg',
    link: 'https://www.loom.com/share/bf342f75364d4986a365b0f6e0340cb1',
    tags: ['Make.com', 'Twilio', 'OpenAI'],
  },
  {
    id: 3,
    title: 'SOLAR INTELLIGENCE PLATFORM',
    category: 'Full Stack / AI',
    year: '2025–2026',
    description: 'A full-stack solar intelligence platform combining a Next.js dashboard, NestJS API, FastAPI analytics engine and integrated solar, weather and geolocation providers.',
    img: 'https://res.cloudinary.com/dpz2lh8hu/image/upload/v1749750619/Screenshot_2025-06-12_154225_fgduws.png',
    link: 'https://github.com/stato10/Solar-Intelligence-Platform',
    tags: ['Next.js', 'NestJS', 'FastAPI', 'PostgreSQL', 'Prisma', 'Docker', 'OpenAI'],
  },
  {
    id: 1,
    title: 'PLAY_CV',
    category: 'AI Application',
    year: '2025',
    description: 'An innovative AI-powered application that transforms traditional CVs into interactive, gamified experiences. It uses advanced parsing to analyze resumes and presents them in a dynamic format that stands out to recruiters.',
    img: 'https://res.cloudinary.com/dpz2lh8hu/image/upload/v1749750617/Screenshot_2025-06-12_153316_pujcpr.png',
    link: 'https://github.com/stato10/Play_cv',
    tags: ['React', 'TailwindCSS', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'OpenAI', 'MongoDB', 'GCP'],
  },
  {
    id: 4,
    title: 'CRITICS MEDIA',
    category: 'Web Platform',
    year: '2025',
    description: 'A modern media aggregation platform for film and TV critics. Features a sleek, responsive design that allows users to browse reviews, watch trailers, and engage with a community of entertainment enthusiasts.',
    img: 'https://res.cloudinary.com/dpz2lh8hu/image/upload/v1753432718/Screenshot_2025-07-25_113126_a9imp7.png',
    link: 'https://github.com/stato10/criticsmedia',
    tags: ['PHP', 'WordPress'],
  },
  {
    id: 5,
    title: 'GOV SYSTEM',
    category: 'Enterprise',
    year: '2024',
    description: 'A robust enterprise solution designed for government administrative processes. It streamlines workflows, manages secure data, and improves inter-departmental communication with a focus on security and reliability.',
    img: 'https://i.ytimg.com/vi/YLsIIddZV_E/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAblNA_tdqn8Yk_iMfW1xQDykZLGw',
    link: null,
    tags: ['SaaS', 'Security', 'Database'],
  },
  {
    id: 6,
    title: 'PERFECT DRESS',
    category: 'E-Commerce',
    year: '2024',
    description: 'An elegant e-commerce boutique specializing in formal wear. The site features a sophisticated filtering system, high-resolution galleries, and a seamless checkout process designed to enhance the shopping experience.',
    img: perfectDressHero,
    link: 'https://stato10.github.io/PerfectDress/',
    tags: ['React', 'TailwindCSS', 'JavaScript', 'HTML', 'CSS'],
  },
]

function Projects() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const { wrapRef, gridRef } = useScrubbedBentoGallery(sectionRef)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const el = headerRef.current
      if (!el || reduce) return

      gsap.from(el.children, {
        opacity: 0,
        y: 48,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="portfolio" className="relative z-10 scroll-mt-24 py-32">
      <div className="container-custom mx-auto px-4 md:px-8">
        <div
          ref={headerRef}
          className="mb-16 flex flex-col gap-6 border-b border-white/10 pb-8 md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h2 className="mb-2 font-display text-4xl text-primary md:text-7xl">SELECTED WORKS</h2>
            <p className="max-w-lg text-text-muted">
              A collection of projects exploring the intersection of design, artificial intelligence, and user experience.
            </p>
          </div>
          <span className="hidden font-sans text-sm uppercase tracking-widest text-text-muted md:block">
            (2024 — 2025)
          </span>
        </div>
      </div>

      {/* Full-bleed bento (viewport-based grid like CodePen) */}
      <div ref={wrapRef} className="gallery-wrap">
        <div ref={gridRef} className="gallery gallery--bento">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link || `#project-${project.id}`}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              className="gallery__item group relative block h-full min-h-0 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src={project.img}
                alt={project.title}
                className="min-h-[4rem] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-display text-[0.65rem] leading-tight text-primary sm:text-xs">{project.title}</span>
                <span className="mt-1 text-[0.6rem] uppercase tracking-wider text-zinc-400">{project.category}</span>
              </div>
            </a>
          ))}
          <div className="gallery__item gallery__item--filler hidden md:block" aria-hidden />
        </div>
      </div>

      <div className="container-custom mx-auto mt-24 space-y-24 px-4 md:mt-32 md:space-y-32 md:px-8">
        {projects.map((project) => (
          <article
            key={`detail-${project.id}`}
            id={`project-${project.id}`}
            className="scroll-mt-28 border-t border-white/[0.06] pt-16 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
              <div className="shrink-0 lg:w-2/5">
                <a
                  href={project.link || `#project-${project.id}`}
                  target={project.link ? '_blank' : '_self'}
                  rel={project.link ? 'noopener noreferrer' : undefined}
                  className="block overflow-hidden rounded-2xl border border-white/[0.1] shadow-hub"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <img src={project.img} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                </a>
              </div>
              <div className="flex flex-col items-start text-left lg:w-3/5">
                <span className="mb-4 rounded-full border border-primary/35 bg-primary/[0.06] px-3 py-1 font-sans text-sm uppercase tracking-widest text-primary">
                  {project.category}
                </span>
                <h3 className="mb-6 font-display text-3xl text-primary md:text-5xl">{project.title}</h3>
                <p className="mb-8 text-lg leading-relaxed text-text-muted">{project.description}</p>
                <div className="mb-8 flex flex-wrap gap-3">
                  {project.tags &&
                    project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.06] bg-surface-elevated px-2 py-1 font-sans text-xs text-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="font-sans text-text-muted">{project.year}</span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-2 border-b border-primary/30 pb-0.5 text-primary transition-colors hover:border-primary hover:text-text-primary"
                    >
                      <span className="font-display text-sm uppercase tracking-wide">Case Study</span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                      >
                        <path
                          d="M1 1H11M11 1V11M11 1L1 11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
