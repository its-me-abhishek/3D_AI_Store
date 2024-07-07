import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import { useSnapshot } from 'valtio';
import state from '../store';
import SweatShirt from './Sweatshirt';
import Shoe from './Shoe';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      <CameraRig>
        <Backdrop />
        <Center>
          {snap.selectedModel === 'Shirt' && <Shirt />}
          {snap.selectedModel === 'Sweatshirt' && <SweatShirt />}
          {snap.selectedModel === 'Shoe' && <Shoe />}
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel