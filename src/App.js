import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { CameraControls, OrthographicCamera } from '@react-three/drei'
import QuickSort from './algos/QuickSort'
import { useState } from 'react'
import BoxGen from './idk/boxGen'

function App() {
  
  return (
    <div id="canvas-container">
      <Canvas fallback={<div>Sorry no WebGL supported!</div>} camera={{ position: [0, 0, 50], fov: 25 }}>

        <ambientLight intensity={0.15} />

        <directionalLight position={[0,0,5]} />
      
      <CameraControls />

        {/* <QuickSort /> */}
        <BoxGen />
      
      </Canvas>
    </div>
  )
}

// createRoot(document.getElementById('root')).render(<App />)


export default App;
