import React, { useRef } from 'react'
import { useSnapshot } from 'valtio';
import state from '../store';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

export function Shoe(props) {
    const { nodes, materials } = useGLTF('/shoe_variants.glb')
    const snap = useSnapshot(state);
    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);
    useFrame((state, delta) => easing.dampC(materials.phong1SG.color, snap.color, 0.25, delta));
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Shoe.geometry}
                material={materials.phong1SG}
                position={[0.002, 0.076, 0.005]}
                scale={0.149}
            >
                {snap.isFullTexture && (
                    <Decal
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={1}
                        map={fullTexture}
                    />
                )}

                {snap.isLogoTexture && (
                    <Decal
                        position={[-0.45, -0.1, 0.2]}
                        rotation={[0, -15, 0]}
                        scale={0.2}
                        map={logoTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}</mesh>
        </group>
    )
}

useGLTF.preload('/shoe_variants.glb')

export default Shoe