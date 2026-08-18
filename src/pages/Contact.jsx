import { motion } from 'framer-motion'
import { profile } from '../data/experience'

const revealAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    }
  },
  viewport: { once: true, margin: "-10%" }
}

function Contact() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-16 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="container-custom mx-auto px-6 relative z-10 w-full max-w-4xl">
        <motion.div
          variants={revealAnimation}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="bg-surface/80 backdrop-blur-xl border border-white/[0.1] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 shadow-hub text-center relative overflow-hidden"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <h1 className="font-display text-4xl md:text-7xl text-primary mb-8 tracking-tight">
            LET'S WORK<br />TOGETHER
          </h1>

          <p className="text-text-muted text-lg md:text-xl font-sans max-w-2xl mx-auto mb-12 leading-relaxed">
            I'm currently available for freelance projects and open to full-time opportunities. If you have a project that needs some creative injection, I'd love to hear from you.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 border border-primary/30 rounded-full font-display tracking-widest uppercase text-text-muted hover:text-primary hover:border-primary transition-all duration-300 hover:bg-primary/10"
            >
              GitHub
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 border border-primary/30 rounded-full font-display tracking-widest uppercase text-text-muted hover:text-primary hover:border-primary transition-all duration-300 hover:bg-primary/10"
            >
              LinkedIn
            </a>
            {profile.contact.email && (
              <a
                href={`mailto:${profile.contact.email}`}
                className="group relative px-10 py-5 bg-primary text-bg-primary rounded-full font-display tracking-widest uppercase overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <span className="relative z-10">Email Me</span>
                <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
              </a>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-primary/20 grid grid-cols-1 gap-8">
            {profile.location && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-sans uppercase tracking-widest text-text-muted">Location</span>
                <span className="font-display text-primary">{profile.location}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans uppercase tracking-widest text-text-muted">Socials</span>
              <div className="flex justify-center gap-4 text-primary">
                <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
                <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.main>
  )
}

export default Contact
