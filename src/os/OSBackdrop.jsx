const environmentArtwork = `${import.meta.env.BASE_URL}images/os/stato-environment.jpg`

export default function OSBackdrop({ variant = 'desktop' }) {
  return (
    <div className={`os-backdrop os-backdrop--${variant}`} aria-hidden="true">
      <img src={environmentArtwork} alt="" draggable="false" />
      <span />
    </div>
  )
}
