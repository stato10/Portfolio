export const windowMotion = {
  initial: { opacity: 0, scale: 0.94, y: 22, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.96, y: 18, filter: 'blur(5px)' },
  transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
}

export const reducedWindowMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 },
}
