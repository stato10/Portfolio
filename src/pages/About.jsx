import { motion } from 'framer-motion'
import aboutImg from '../assets/stato-portrait.webp'
import { profile } from '../data/experience'

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
}

const revealAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // The "Premium" Curve
    }
  },
  viewport: { once: true, margin: "-10%" }
}

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    }
  },
}

function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32 pt-40 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="container-custom mx-auto px-6">
        {/* Header Block */}
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.h1
            variants={revealAnimation}
            className="flex flex-col font-display text-5xl md:text-8xl text-primary mb-8"
          >
            <span className="opacity-50 text-3xl md:text-4xl font-sans tracking-widest mb-4 block">01 / WHO I AM</span>
            <span>PASSIONATE</span>
            <span className="text-text-muted">BUILDER.</span>
          </motion.h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Image Card */}
          <motion.div
            variants={revealAnimation}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              className="relative z-10 rounded-[3rem] overflow-hidden bg-surface/80 backdrop-blur-md border border-white/[0.1] shadow-hub"
            >
              <img
                src={aboutImg}
                alt="Profile"
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
              />

              {/* Image Overlay Texture */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent pointer-events-none" />

              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-display text-2xl text-primary">AVRAHAM STATO</p>
                <p className="font-sans text-sm tracking-widest text-text-muted uppercase">Software Engineer · AI & Systems Automation</p>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-dashed border-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          </motion.div>

          {/* Right Column: Content Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Bio Card */}
            <motion.div
              variants={revealAnimation}
              className="p-10 rounded-[2rem] bg-primary/5 border border-primary/20 backdrop-blur-sm hover:bg-primary/10 transition-colors duration-500"
            >
              <h3 className="font-display text-2xl text-primary mb-4">THE JOURNEY</h3>
              <p className="text-text-muted text-lg leading-relaxed font-sans">
                {profile.experienceNote}
              </p>
            </motion.div>

            {/* Stats / Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                variants={revealAnimation}
                className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <span className="block font-display text-4xl text-primary mb-2">2018</span>
                <span className="text-xs tracking-widest text-text-muted uppercase">Production Systems Since</span>
              </motion.div>
              <motion.div
                variants={revealAnimation}
                className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <span className="block font-display text-4xl text-primary mb-2">90</span>
                <span className="text-xs tracking-widest text-text-muted uppercase">Diploma Grade</span>
              </motion.div>
            </div>

            {/* 'What I Do' Pill */}
            <motion.div
              variants={revealAnimation}
              className="p-10 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm group cursor-none"
            >
              <h3 className="font-display text-xl text-primary mb-6 flex items-center justify-between">
                <span>TECHNICAL ARSENAL</span>
                <svg className="w-6 h-6 transform group-hover:rotate-45 transition-transform duration-500 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'Typescript', 'Next.js', 'PostgreSQL', 'AWS', 'Docker'].map((tech) => (
                  <span key={tech} className="px-4 py-2 rounded-full border border-primary/30 text-xs text-text-muted font-sans tracking-wider uppercase hover:bg-primary hover:text-bg-primary hover:border-primary transition-all duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}

export default About
