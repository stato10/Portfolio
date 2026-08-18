import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import emailjs from '@emailjs/browser'
import { profile } from '../data/experience'

function ContactSection() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (publicKey) {
      emailjs.init(publicKey)
    }
  }, [])

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const head = sectionRef.current?.querySelector('.contact-header')
      const cols = sectionRef.current?.querySelectorAll('.contact-col')
      if (reduce) return

      if (head) {
        gsap.from(head.children, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: head,
            start: 'top 86%',
            once: true,
          },
        })
      }

      if (cols?.length) {
        gsap.from(cols, {
          opacity: 0,
          y: 40,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cols[0],
            start: 'top 88%',
            once: true,
          },
        })
      }
    },
    { scope: sectionRef }
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear status message when user starts typing
    if (submitStatus) {
      setSubmitStatus(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Get EmailJS credentials from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      // Validate environment variables
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing. Please check your environment variables.')
      }

      // Send email using EmailJS
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      )

      if (result.text === 'OK') {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Message sent successfully! I\'ll get back to you soon.' 
        })
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' })
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000)
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      let errorMessage = 'Failed to send message. Please try again or email me directly.'
      
      // Provide more specific error messages
      if (error.text) {
        errorMessage = `Error: ${error.text}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setSubmitStatus({ type: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="section-padding bg-surface/80 border-t border-white/[0.06] scroll-mt-24">
      <div className="container-custom max-w-4xl">
        <div className="contact-header text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium">Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            <span className="text-text-primary">Interested?</span>
            <span className="block text-primary mt-2">Contact Me</span>
          </h2>
          <p className="text-text-muted text-sm max-w-2xl mx-auto leading-relaxed">
            Let&apos;s discuss how we can work together to bring your ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="contact-col bg-bg-primary/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/[0.1] shadow-hub">
            <h3 className="text-lg font-bold text-primary mb-4">Send a Message</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-text-muted mb-2">
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface text-text-primary border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-zinc-600"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-text-muted mb-2">
                  Your Email <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface text-text-primary border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-zinc-600"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-text-muted mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface text-text-primary border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-zinc-600"
                  placeholder="Project Inquiry"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-text-muted mb-2">
                  Your Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface text-text-primary border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y transition-all placeholder:text-zinc-600"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              {submitStatus && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-bg-primary rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-accent hover:shadow-hub-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Resume Download */}
          <div className="contact-col space-y-6">
            {/* Contact Information */}
            <div className="bg-bg-primary p-6 rounded-lg border border-primary/20">
              <h3 className="text-lg font-bold text-primary mb-4">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-text-primary font-semibold mb-1 text-sm uppercase tracking-wider">Email</h4>
                    <a href={`mailto:${profile.contact.email}`} className="text-text-muted hover:text-primary transition-colors text-sm">
                      {profile.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-text-primary font-semibold mb-1 text-sm uppercase tracking-wider">LinkedIn</h4>
                    <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors text-sm">
                      {profile.contact.linkedinLabel}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-text-primary font-semibold mb-1 text-sm uppercase tracking-wider">GitHub</h4>
                    <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors text-sm">
                      {profile.contact.githubLabel}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Download Section */}
            <div className="bg-bg-primary/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/[0.1] shadow-hub">
              <h3 className="text-lg font-bold text-primary mb-3">Download Resume</h3>
              <p className="text-text-muted text-sm mb-6">
                Download my resume to learn more about my experience and skills
              </p>
              <a
                href={profile.resumeUrl}
                download
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-bg-primary rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-accent hover:shadow-hub-glow transition-all duration-300 w-full justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Resume (PDF)</span>
                <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <p className="text-xs text-text-muted mt-3 text-center">
                Or view my <a href="#skills" className="text-primary hover:text-accent">skills section</a> for a quick overview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
