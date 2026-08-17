import { motion } from 'framer-motion'
import MenuBar from './MenuBar'
import Dock from './Dock'
import DesktopIcons from './DesktopIcons'
import WindowManager from './WindowManager'

export default function Desktop({ ready }) {
  return (
    <motion.main
      className="os-desktop"
      initial={false}
      animate={{ opacity: ready ? 1 : 0.65, scale: ready ? 1 : 1.012 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={!ready}
    >
      <div className="desktop-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <MenuBar />
      <section className="desktop-identity" aria-label="STATO OS introduction">
        <p>STATO OS <span>/ 01</span></p>
        <h1>Software Engineer<br /><em>AI Systems Builder</em></h1>
        <div className="identity-status"><i /> Available for selected projects <span>Tel Aviv · GMT+3</span></div>
      </section>
      <DesktopIcons />
      <WindowManager />
      <Dock />
      <p className="desktop-coordinate">34.7818° N&nbsp;&nbsp; 32.0853° E</p>
    </motion.main>
  )
}
