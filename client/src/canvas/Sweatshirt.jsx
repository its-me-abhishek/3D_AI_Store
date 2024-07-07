import React from 'react';
import { useSnapshot } from 'valtio';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import state from '../store';

const SweatShirt = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/sweatshirt.glb');
    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);

    useFrame((state, delta) => easing.dampC(materials.Peachskin_details.color, snap.color, 0.25, delta));
    useFrame((state, delta) => easing.dampC(materials.Peachskin_outside.color, snap.color, 0.25, delta));
    useFrame((state, delta) => easing.dampC(materials.Peachskin_inside.color, snap.color, 0.25, delta));

    const stateString = JSON.stringify(snap);

    return (
        <group key={stateString}>
            <mesh
                castShadow
                geometry={nodes['crewneck-sweatshirt-overlay'].geometry}
                material={materials['crewneck-sweatshirt-overlay']}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0.002]}
                scale={0.0007}
                dispose={null}
            >
                {snap.isFullTexture && (
                    <Decal
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={0.0007}
                        map={fullTexture}
                    />
                )}
                {snap.isLogoTexture && (
                    <Decal
                        position={[0, 0, 0.1]}
                        rotation={[0, 0, 0]}
                        scale={0.000105}
                        map={logoTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}
            </mesh>
            <mesh
                castShadow
                geometry={nodes.details.geometry}
                material={materials.Peachskin_details}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.0007}
                dispose={null}
            />
            <mesh
                castShadow
                geometry={nodes.outside.geometry}
                material={materials.Peachskin_outside}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.0007}
                dispose={null}
            />
        </group>
    );
}

useGLTF.preload('/sweatshirt.glb');

export default SweatShirt;
