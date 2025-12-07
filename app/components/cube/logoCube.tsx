'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const LogoCube = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseDown = useRef(false);
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    const targetRotationX = useRef(0);
    const targetRotationY = useRef(0);
    const currentRotationX = useRef(0);
    const currentRotationY = useRef(0);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.position.z = 5;

        // ライティング
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // エッジを進むネオン用のマーカー（小さな球体）
        const edgeMarkerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const edgeMarkerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 1,
        });
        const edgeMarker = new THREE.Mesh(edgeMarkerGeometry, edgeMarkerMaterial);

        // エッジマーカーのポイントライト
        const edgeMarkerLight = new THREE.PointLight(0x00ffff, 1.5, 2);
        edgeMarker.add(edgeMarkerLight);

        // テクスチャ作成関数
        const createTextTexture = (text: string, fontSize: number = 120) => {
            const textCanvas = document.createElement('canvas');
            textCanvas.width = 512;
            textCanvas.height = 512;
            const ctx = textCanvas.getContext('2d')!;

            // 背景
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 512, 512);

            // テキスト
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 256, 256);

            return new THREE.CanvasTexture(textCanvas);
        };

        // SVGロゴテクスチャ作成
        const createLogoTexture = () => {
            const logoCanvas = document.createElement('canvas');
            logoCanvas.width = 512;
            logoCanvas.height = 512;
            const ctx = logoCanvas.getContext('2d')!;

            // 背景（グレー）
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(0, 0, 512, 512);

            // SVGを描画
            const svgString = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138.4 149.7" width="400" height="400">
                    <path fill="white" d="M83.6,46.9c0.6,1.1,1.5,1.9,2.7,2.3c1.2,0.4,2.4,0.4,3.6-0.2c1.1-0.5,1.9-1.4,2.3-2.6c0.4-1.2,0.3-2.3-0.2-3.5 c-0.2-0.4-0.6-1.2-1.2-2.3c-0.6-1.2-1-2.1-1.4-2.7c-0.6-1.1-1.5-1.9-2.7-2.3c-1.2-0.4-2.4-0.3-3.5,0.3h-0.2 c-1.1,0.5-1.9,1.4-2.2,2.6c-0.3,1.2-0.2,2.3,0.4,3.4C81.9,43.8,82.7,45.3,83.6,46.9z" />
                    <path fill="white" d="M102.6,35.9c-0.6-1.1-1.5-1.9-2.7-2.2c-1.2-0.3-2.4-0.2-3.5,0.4l-0.2,0.1c-1.1,0.5-1.9,1.4-2.2,2.7 c-0.3,1.2-0.2,2.4,0.4,3.5c0.3,0.5,0.8,1.4,1.4,2.5c0.6,1.1,1,2,1.3,2.5c0.6,1.1,1.5,1.9,2.7,2.3c1.2,0.4,2.4,0.3,3.5-0.2l0.2-0.2 c1.1-0.5,1.9-1.4,2.3-2.6c0.4-1.2,0.3-2.3-0.3-3.5C105.3,41.1,104.4,39.3,102.6,35.9z" />
                    <path fill="white" d="M94.3,56.5c-0.4-1.2-1.1-2.1-2.3-2.6c-1.1-0.6-2.3-0.6-3.5-0.2C78.9,57,68.2,59.8,56.6,62 c-0.4,0.1-0.6-0.1-0.6-0.6v-16c0-1.2-0.5-2.3-1.4-3.2c-0.9-0.9-2-1.4-3.2-1.4h-6.5c-1.2,0-2.3,0.5-3.2,1.4c-0.9,0.9-1.4,2-1.4,3.2 v37.3c0,7.6,1.4,12.9,4.3,15.8c2.9,2.9,7.9,4.3,15,4.3c10.1,0,20.6-0.3,31.3-1c1.2-0.1,2.3-0.6,3.1-1.5c0.9-1,1.3-2.1,1.2-3.3 L95.1,93c-0.1-1.2-0.6-2.3-1.5-3.1c-0.9-0.9-2-1.2-3.3-1.1c-9,0.6-18.6,0.9-28.8,0.9c-2.3,0-3.8-0.4-4.6-1.1 c-0.7-0.8-1.1-2.4-1.1-4.9v-6.9c0-0.5,0.2-0.8,0.6-0.9c12.8-2.4,24.8-5.4,36.2-9.3c1.2-0.4,2.1-1.1,2.6-2.3c0.6-1.1,0.7-2.3,0.3-3.5 L94.3,56.5z" />
                    <path fill="white" d="M132.5,5.5c-3.8-3.7-8.8-5.6-14.1-5.5C105.9,0.4,87,0.8,68.2,0.8C50,0.8,31.9,0.4,20,0 C14.7-0.1,9.7,1.8,5.9,5.5C2.1,9.2,0,14.1,0,19.4V126c0,6.2,2.4,12,6.7,16.4c4.3,4.4,10.1,6.9,16.3,7c12,0.2,30,0.4,47.7,0.4 c16.9,0,33.6-0.2,44.6-0.4c6.2-0.1,12-2.6,16.3-7c4.3-4.4,6.7-10.2,6.7-16.4V19.4C138.4,14.1,136.3,9.1,132.5,5.5z M128.3,116.2 c0,7.2-5.9,13.2-13.1,13.3c-11,0.2-27.7,0.4-44.5,0.4c-17.7,0-35.7-0.2-47.6-0.4c-7.2-0.1-13.1-6.1-13.1-13.3V19.4 c0-2.5,1-4.9,2.8-6.7c1.7-1.7,4-2.6,6.5-2.6c0.1,0,0.2,0,0.3,0c12,0.4,30.2,0.8,48.6,0.8c18.9,0,37.9-0.5,50.6-0.8 c2.5-0.1,4.9,0.9,6.7,2.6c1.8,1.8,2.8,4.1,2.8,6.7V116.2z" />
                </svg>
            `;

            const img = new Image();
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);

            return new Promise<THREE.CanvasTexture>((resolve) => {
                img.onload = () => {
                    ctx.drawImage(img, 56, 31, 400, 450);
                    URL.revokeObjectURL(url);
                    resolve(new THREE.CanvasTexture(logoCanvas));
                };
                img.src = url;
            });
        };

        // Memberテキストテクスチャ（クリッカブル）
        const createMemberTexture = () => {
            const memberCanvas = document.createElement('canvas');
            memberCanvas.width = 512;
            memberCanvas.height = 512;
            const ctx = memberCanvas.getContext('2d')!;

            // 背景（グレーグラデーション）
            const gradient = ctx.createLinearGradient(0, 0, 512, 512);
            gradient.addColorStop(0, '#2a2a2a');
            gradient.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);

            // Member テキスト（ネオングロー）
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('MEMBER', 256, 256);

            // 下線（ネオン）
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(100, 300);
            ctx.lineTo(412, 300);
            ctx.stroke();

            // ホバーヒント
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#999999';
            ctx.font = '24px Arial';
            ctx.fillText('Click to view', 256, 360);

            return new THREE.CanvasTexture(memberCanvas);
        };

        // 立方体のマテリアル作成
        const createCubeMaterials = async () => {
            const logoTexture = await createLogoTexture();
            const memberTexture = createMemberTexture();

            const materials = [
                new THREE.MeshStandardMaterial({
                    map: memberTexture,
                    metalness: 0.2,
                    roughness: 0.8,
                    color: 0xffffff,
                }), // 右 (Member)
                new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    metalness: 0.3,
                    roughness: 0.7,
                }), // 左
                new THREE.MeshStandardMaterial({
                    map: logoTexture,
                    metalness: 0.2,
                    roughness: 0.8,
                    color: 0xffffff,
                }), // 上 (Logo TOP)
                new THREE.MeshStandardMaterial({
                    map: logoTexture,
                    color: new THREE.Color(0xffffff),
                    metalness: 0.3,
                    roughness: 0.7,
                }), // 下
                new THREE.MeshStandardMaterial({
                    map: logoTexture,
                    color: 0xffffff,
                    metalness: 0.3,
                    roughness: 0.7,
                }), // 前
                new THREE.MeshStandardMaterial({
                    map: logoTexture,
                    color: 0xffffff,
                    metalness: 0.3,
                    roughness: 0.7,
                }), // 後
            ];

            return materials;
        };

        // エッジグロー用のライン
        let cubeEdges: THREE.LineSegments;
        let edgesGeometry: THREE.EdgesGeometry;

        // 立方体作成（丸みのある小さめ）
        let cube: THREE.Mesh;
        createCubeMaterials().then((materials) => {
            const geometry = new RoundedBoxGeometry(1.5, 1.5, 1.5, 5, 0.1); // サイズ1.5、丸み0.1
            cube = new THREE.Mesh(geometry, materials);
            scene.add(cube);

            // エッジのグローエフェクト（ネオンカラー）
            edgesGeometry = new THREE.EdgesGeometry(geometry);
            const edgesMaterial = new THREE.LineBasicMaterial({
                color: 0x222222,  // 暗めのベース
                linewidth: 2,
                transparent: true,
                opacity: 0.3
            });
            cubeEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
            cube.add(cubeEdges);

            // エッジマーカーを立方体に追加
            cube.add(edgeMarker);

            // 初期回転（ロゴが正面に見えるように - 真上から）
            cube.rotation.x = -Math.PI / 2; // -90度で真上を向く
            currentRotationX.current = -Math.PI / 2;
            targetRotationX.current = -Math.PI / 2;
        });

        // マウスイベント（ノイズキャンセル用にフラグを使用）
        let isInteracting = false;

        const handleMouseDown = (e: MouseEvent) => {
            mouseDown.current = true;
            isInteracting = true;
            mouseX.current = e.clientX;
            mouseY.current = e.clientY;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!mouseDown.current) return;

            const deltaX = e.clientX - mouseX.current;
            const deltaY = e.clientY - mouseY.current;

            targetRotationY.current += deltaX * 0.01;
            targetRotationX.current += deltaY * 0.01;

            mouseX.current = e.clientX;
            mouseY.current = e.clientY;
        };

        const handleMouseUp = () => {
            mouseDown.current = false;
            isInteracting = false;
        };

        // クリックイベント（Member面をクリック）
        const handleClick = () => {
            if (!cube) return;

            // 現在の回転から右面（Member）がどれくらい見えているか判定
            const normalizedRotationY = ((targetRotationY.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

            // 右面が見えている範囲（約45度〜135度）
            if (normalizedRotationY > Math.PI / 4 && normalizedRotationY < (3 * Math.PI) / 4) {
                // Member セクションにスクロール
                const memberSection = document.getElementById('member-section');
                if (memberSection) {
                    memberSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('click', handleClick);

        // エッジを進むネオンの経路（立方体のエッジポイント）
        const edgePath = [
            // 上面の四角
            new THREE.Vector3(0.75, 0.75, 0.75),
            new THREE.Vector3(-0.75, 0.75, 0.75),
            new THREE.Vector3(-0.75, 0.75, -0.75),
            new THREE.Vector3(0.75, 0.75, -0.75),
            new THREE.Vector3(0.75, 0.75, 0.75),
            // 下に降りる
            new THREE.Vector3(0.75, -0.75, 0.75),
            // 下面の四角
            new THREE.Vector3(-0.75, -0.75, 0.75),
            new THREE.Vector3(-0.75, -0.75, -0.75),
            new THREE.Vector3(0.75, -0.75, -0.75),
            new THREE.Vector3(0.75, -0.75, 0.75),
            new THREE.Vector3(-0.75, -0.75, 0.75),
            // 上に戻る
            new THREE.Vector3(-0.75, 0.75, 0.75),
        ];
        let currentEdgePoint = 0;
        let edgeProgress = 0;

        // アニメーション
        let time = 0;
        const animate = () => {
            time += 0.01;

            if (cube) {
                // スムーズな回転
                currentRotationX.current += (targetRotationX.current - currentRotationX.current) * 0.1;
                currentRotationY.current += (targetRotationY.current - currentRotationY.current) * 0.1;

                cube.rotation.x = currentRotationX.current;
                cube.rotation.y = currentRotationY.current;

                // 微妙な浮遊アニメーション
                cube.position.y = Math.sin(time) * 0.15;

                // ジリジリノイズ（触っていない時のみ）- 強化版
                if (!isInteracting) {
                    // 高周波の強い振動
                    cube.position.x = (Math.random() - 0.5) * 0.04;  // 0.01 → 0.04
                    cube.position.z = (Math.random() - 0.5) * 0.04;  // 0.01 → 0.04

                    // 回転振動も強化
                    cube.rotation.x += (Math.random() - 0.5) * 0.008;  // 0.002 → 0.008
                    cube.rotation.y += (Math.random() - 0.5) * 0.008;  // 0.002 → 0.008
                    cube.rotation.z = (Math.random() - 0.5) * 0.012;   // 0.003 → 0.012
                } else {
                    // 触っている時はノイズをキャンセル（スムーズに戻す）
                    cube.position.x *= 0.9;
                    cube.position.z *= 0.9;
                    cube.rotation.z *= 0.9;
                }
            }

            // エッジを進むネオン
            if (edgePath.length > 0 && edgeMarker) {
                edgeProgress += 0.02;  // 進行速度

                if (edgeProgress >= 1) {
                    edgeProgress = 0;
                    currentEdgePoint = (currentEdgePoint + 1) % (edgePath.length - 1);
                }

                const startPoint = edgePath[currentEdgePoint];
                const endPoint = edgePath[currentEdgePoint + 1];

                // 線形補間
                edgeMarker.position.lerpVectors(startPoint, endPoint, edgeProgress);

                // ネオンの色変化
                const hue = (time * 0.15) % 1;
                edgeMarkerMaterial.color.setHSL(hue, 1, 0.5);
                edgeMarkerMaterial.opacity = 0.8 + Math.sin(time * 8) * 0.2;

                // ポイントライトの色も変化
                edgeMarkerLight.color.setHSL(hue, 1, 0.5);
                edgeMarkerLight.intensity = 1 + Math.sin(time * 8) * 0.5;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // リサイズ対応
        const handleResize = () => {
            if (!containerRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0a0a0a' }}>
            {/* 背景グラデーション（グレー基調） */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, rgba(40, 40, 40, 0.3) 0%, rgba(10, 10, 10, 1) 60%, rgba(0, 0, 0, 1) 100%)'
                }}
            />

            {/* ネオングローエフェクト */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse"
                style={{ background: 'rgba(0, 255, 255, 0.1)' }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[80px] animate-pulse"
                style={{ background: 'rgba(255, 0, 255, 0.08)', animationDelay: '1s' }}
            />

            <div className="relative z-10">
                <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing" />
            </div>

            {/* UIガイド（グレー基調） */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-4 z-20">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-full">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                        </svg>
                        <span className="text-gray-300 text-sm font-medium">Drag to Rotate</span>
                    </div>
                    <div className="h-4 w-px bg-gray-600" />
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="text-gray-300 text-sm font-medium">Find "MEMBER" & Click</span>
                    </div>
                </div>
            </div>

            {/* スクロールヒント */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
};

