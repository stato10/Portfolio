import { useState } from 'react'
import BootScreen from './os/BootScreen'
import Desktop from './os/Desktop'
import { OSProvider } from './store/useOSStore'

function App() {
  const [booted, setBooted] = useState(false)

  return (
    <OSProvider>
      <Desktop ready={booted} />
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
    </OSProvider>
  )
}

export default App
