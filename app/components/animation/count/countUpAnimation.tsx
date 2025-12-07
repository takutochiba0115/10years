'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { drawText } from './textRenderer';
import { easeOutCubic } from './easing';
import { BeCauseLogo } from '../../../assets/be-cause-logo';

type CountUpAnimationProps = {
    onComplete?: () => void;
};

export const CountUpAnimation = ({ onComplete }: CountUpAnimationProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showLogo, setShowLogo] = useState(false);
    const [tvShutdown, setTvShutdown] = useState(false);

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
                yearsProgress += 0.04;
                if (yearsProgress > 0.25 && yearsCharCount < 5) {
                    yearsProgress = 0;
                    yearsCharCount++;
                }

                if (yearsCharCount >= 5 && yearsProgress > 0.5) {
                    // yearsが完全に表示されたらロゴを表示
                    setShowLogo(true);
                }

                if (yearsCharCount >= 5 && yearsProgress > 2.5) {
                    isAnimating = false;
                    // テレビ切れるアニメーション開始
                    setTvShutdown(true);
                    // アニメーション完了後、次のページへ
                    setTimeout(() => {
                        if (onComplete) {
                            onComplete();
                        }
                    }, 800);
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
        <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden">
            {/* メインコンテンツエリア */}
            <div className={`absolute inset-0 ${tvShutdown ? 'tv-shutdown' : ''}`}>
                {/* グリッチロゴ（背面） */}
                {showLogo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <div className="w-[600px] h-[600px] opacity-20">
                            <div className="lcd-glitch-container">
                                <div className="lcd-layer lcd-red">
                                    <BeCauseLogo />
                                </div>
                                <div className="lcd-layer lcd-green">
                                    <BeCauseLogo />
                                </div>
                                <div className="lcd-layer lcd-blue">
                                    <BeCauseLogo />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* カウントアップキャンバス（前面） */}
                <canvas ref={canvasRef} className="w-full h-full relative z-10 canvas-glitch" />

                {/* スキャンライン効果 */}
                {showLogo && <div className="scanlines" />}

                {/* ノイズエフェクト */}
                {showLogo && <div className="lcd-noise" />}
            </div>

            {/* ホワイトフラッシュ（テレビ切れる瞬間） */}
            {tvShutdown && <div className="tv-flash" />}

            {/* 液晶エフェクト & テレビシャットダウンのスタイル */}
            <style jsx>{`
                /* キャンバスグリッチ */
                .canvas-glitch {
                    animation: canvas-jitter 0.1s infinite;
                }
                
                @keyframes canvas-jitter {
                    0%, 100% { 
                        filter: contrast(1) brightness(1);
                        transform: translate(0, 0);
                    }
                    10% { 
                        filter: contrast(1.1) brightness(1.05);
                        transform: translate(1px, 0);
                    }
                    20% { 
                        filter: contrast(0.95) brightness(0.98);
                        transform: translate(-1px, 1px);
                    }
                    30% { 
                        filter: contrast(1.05) brightness(1.02);
                        transform: translate(0, -1px);
                    }
                    40% { 
                        filter: contrast(1) brightness(1);
                        transform: translate(1px, 1px);
                    }
                    50% { 
                        filter: contrast(1.08) brightness(1.03);
                        transform: translate(-1px, 0);
                    }
                    60% { 
                        filter: contrast(0.98) brightness(0.99);
                        transform: translate(0, 1px);
                    }
                    70% { 
                        filter: contrast(1.03) brightness(1.01);
                        transform: translate(1px, -1px);
                    }
                    80% { 
                        filter: contrast(1.01) brightness(1);
                        transform: translate(-1px, -1px);
                    }
                    90% { 
                        filter: contrast(1.06) brightness(1.04);
                        transform: translate(0, 0);
                    }
                }
                
                /* 液晶グリッチコンテナ */
                .lcd-glitch-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    animation: container-distort 0.3s infinite;
                }
                
                @keyframes container-distort {
                    0%, 100% { transform: scale(1, 1); filter: blur(0px); }
                    10% { transform: scale(1.02, 0.98); filter: blur(0.5px); }
                    20% { transform: scale(0.98, 1.03); filter: blur(0px); }
                    30% { transform: scale(1.01, 0.99); filter: blur(1px); }
                    40% { transform: scale(0.99, 1.02); filter: blur(0px); }
                    50% { transform: scale(1.03, 0.97); filter: blur(0.5px); }
                    60% { transform: scale(0.97, 1.01); filter: blur(0px); }
                    70% { transform: scale(1.02, 1.01); filter: blur(0.8px); }
                    80% { transform: scale(0.98, 0.99); filter: blur(0px); }
                    90% { transform: scale(1.01, 1.02); filter: blur(0.3px); }
                }
                
                .lcd-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    mix-blend-mode: screen;
                }
                
                /* RGB分離エフェクト（荒め） */
                .lcd-red {
                    animation: lcd-red 0.08s infinite;
                    filter: brightness(1.5) contrast(2) saturate(1.5);
                }
                
                .lcd-green {
                    animation: lcd-green 0.11s infinite;
                    filter: brightness(1.3) contrast(1.8) saturate(1.3);
                }
                
                .lcd-blue {
                    animation: lcd-blue 0.09s infinite;
                    filter: brightness(1.6) contrast(2.2) saturate(1.4);
                }
                
                @keyframes lcd-red {
                    0% { transform: translate(0px, 0px); opacity: 1; }
                    10% { transform: translate(3px, 1px); opacity: 0.7; }
                    20% { transform: translate(-2px, 2px); opacity: 1; }
                    30% { transform: translate(4px, -1px); opacity: 0.8; }
                    40% { transform: translate(-1px, 3px); opacity: 0.9; }
                    50% { transform: translate(2px, -2px); opacity: 1; }
                    60% { transform: translate(-3px, 1px); opacity: 0.75; }
                    70% { transform: translate(1px, 2px); opacity: 0.95; }
                    80% { transform: translate(3px, -1px); opacity: 0.85; }
                    90% { transform: translate(-2px, -2px); opacity: 1; }
                    100% { transform: translate(0px, 0px); opacity: 0.9; }
                }
                
                @keyframes lcd-green {
                    0% { transform: translate(0px, 0px); opacity: 0.9; }
                    12% { transform: translate(-3px, 2px); opacity: 1; }
                    24% { transform: translate(2px, -3px); opacity: 0.7; }
                    36% { transform: translate(-1px, 1px); opacity: 0.85; }
                    48% { transform: translate(4px, 2px); opacity: 0.95; }
                    60% { transform: translate(-2px, -1px); opacity: 0.8; }
                    72% { transform: translate(1px, 3px); opacity: 1; }
                    84% { transform: translate(3px, -2px); opacity: 0.75; }
                    100% { transform: translate(0px, 0px); opacity: 0.9; }
                }
                
                @keyframes lcd-blue {
                    0% { transform: translate(0px, 0px); opacity: 0.95; }
                    11% { transform: translate(2px, -2px); opacity: 0.8; }
                    22% { transform: translate(-3px, 1px); opacity: 1; }
                    33% { transform: translate(1px, 3px); opacity: 0.7; }
                    44% { transform: translate(-2px, -2px); opacity: 0.9; }
                    55% { transform: translate(4px, 1px); opacity: 1; }
                    66% { transform: translate(-1px, 2px); opacity: 0.75; }
                    77% { transform: translate(3px, -1px); opacity: 0.85; }
                    88% { transform: translate(-2px, 3px); opacity: 0.95; }
                    100% { transform: translate(0px, 0px); opacity: 0.9; }
                }
                
                /* スキャンライン（強め） */
                .scanlines {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 15;
                    pointer-events: none;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.5),
                        rgba(0, 0, 0, 0.5) 2px,
                        rgba(255, 255, 255, 0.02) 2px,
                        rgba(255, 255, 255, 0.02) 3px,
                        transparent 3px,
                        transparent 5px
                    );
                    animation: scanlines-move 4s linear infinite, scanlines-flicker 0.06s infinite;
                }
                
                @keyframes scanlines-move {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(20px); }
                }
                
                @keyframes scanlines-flicker {
                    0% { opacity: 1; }
                    10% { opacity: 0.8; }
                    20% { opacity: 1; }
                    30% { opacity: 0.6; }
                    40% { opacity: 1; }
                    50% { opacity: 0.9; }
                    60% { opacity: 1; }
                    70% { opacity: 0.7; }
                    80% { opacity: 1; }
                    90% { opacity: 0.85; }
                    100% { opacity: 1; }
                }
                
                /* 液晶ノイズ（強め） */
                .lcd-noise {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 16;
                    pointer-events: none;
                    opacity: 0.15;
                    background-image: 
                        repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.3) 2px),
                        repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.3) 2px);
                    animation: lcd-flicker 0.08s infinite, lcd-shake 0.2s infinite;
                }
                
                @keyframes lcd-flicker {
                    0% { opacity: 0.15; }
                    20% { opacity: 0.25; }
                    40% { opacity: 0.1; }
                    60% { opacity: 0.3; }
                    80% { opacity: 0.12; }
                    100% { opacity: 0.2; }
                }
                
                @keyframes lcd-shake {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(1px, -1px); }
                    50% { transform: translate(-1px, 1px); }
                    75% { transform: translate(1px, 1px); }
                }
                
                /* テレビシャットダウンアニメーション */
                .tv-shutdown {
                    animation: tv-off 0.8s cubic-bezier(0.4, 0.0, 1, 1) forwards;
                }
                
                @keyframes tv-off {
                    0% {
                        transform: scaleY(1) scaleX(1);
                        filter: brightness(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scaleY(1) scaleX(0.95);
                        filter: brightness(1.5);
                    }
                    70% {
                        transform: scaleY(0.01) scaleX(0.8);
                        filter: brightness(2);
                        opacity: 0.8;
                    }
                    85% {
                        transform: scaleY(0.001) scaleX(0.3);
                        filter: brightness(3);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scaleY(0) scaleX(0);
                        filter: brightness(0);
                        opacity: 0;
                    }
                }
                
                /* ホワイトフラッシュ */
                .tv-flash {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                    z-index: 20;
                    animation: flash 0.3s ease-out forwards;
                }
                
                @keyframes flash {
                    0% {
                        opacity: 0;
                        transform: scale(1);
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                }
            `}</style>
        </div>
    );
};


