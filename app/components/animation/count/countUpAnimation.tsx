'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { drawText } from './textRenderer';
import { easeOutCubic } from './easing';

type CountUpAnimationProps = {
    onComplete?: () => void;
};

export const CountUpAnimation = ({ onComplete }: CountUpAnimationProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.position.z = 5;

        // Canvas for text texture (larger for better quality)
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 1024;
        textCanvas.height = 512;
        const textContext = textCanvas.getContext('2d')!;

        // Create text texture
        const textTexture = new THREE.CanvasTexture(textCanvas);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        const geometry = new THREE.PlaneGeometry(8, 4);
        const mesh = new THREE.Mesh(geometry, textMaterial);
        scene.add(mesh);

        let currentNumber = 1;
        let animationProgress = 0;
        let isAnimating = true;
        let showingYears = false;
        let yearsCharCount = 0;
        let yearsProgress = 0;

        function animate() {
            animationProgress += 0.015;

            const easedProgress = easeOutCubic(Math.min(animationProgress, 1));

            const animationIntensity = showingYears ? 0.02 : 0.08;
            const scale = 1 + Math.sin(animationProgress * 3) * animationIntensity;
            mesh.scale.set(scale, scale, 1);

            const rotationIntensity = showingYears ? 0.01 : 0.05;
            mesh.rotation.z = Math.sin(animationProgress * 2) * rotationIntensity;

            if (!showingYears && animationProgress > 1) {
                animationProgress = 0;
                currentNumber++;

                if (currentNumber > 10) {
                    currentNumber = 10;
                    showingYears = true;
                    yearsProgress = 0;
                    animationProgress = 0;
                }
            }

            // Show "years" letter by letter after reaching 10
            if (showingYears) {
                yearsProgress += 0.015;
                if (yearsProgress > 0.25 && yearsCharCount < 5) {
                    yearsProgress = 0;
                    yearsCharCount++;
                }

                if (yearsCharCount >= 5 && yearsProgress > 1) {
                    isAnimating = false;
                    // アニメーション完了後、1秒待ってから次のページへ
                    setTimeout(() => {
                        if (onComplete) {
                            onComplete();
                        }
                    }, 1000);
                }
            }

            const yearsText = 'years'.substring(0, yearsCharCount);
            drawText(textContext, textCanvas, textTexture, currentNumber.toString(), yearsText, easedProgress);
            renderer.render(scene, camera);

            if (isAnimating || showingYears) {
                requestAnimationFrame(animate);
            }
        }

        function handleResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        }

        window.addEventListener('resize', handleResize);

        drawText(textContext, textCanvas, textTexture, currentNumber.toString(), '', 0);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            isAnimating = false;
            renderer.dispose();
            geometry.dispose();
            textMaterial.dispose();
            textTexture.dispose();
        };
    }, [onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};


