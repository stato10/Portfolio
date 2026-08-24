import portrait from '../assets/stato-portrait.webp'

export default function GuideCharacter({ collapsed, onClick, progress }) {
  return (
    <button type="button" className={`guide-character${collapsed ? ' is-collapsed' : ''}`} onClick={onClick} aria-label={collapsed ? `Continue portfolio guide, step ${progress}` : 'Collapse portfolio guide'}>
      <span className="guide-character-portrait"><img src={portrait} alt="" /></span>
      <span className="guide-character-status" aria-hidden="true" />
      {collapsed && <span className="guide-character-copy"><strong>STATO GUIDE</strong><small>Continue · {progress}</small></span>}
    </button>
  )
}
