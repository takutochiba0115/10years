'use client';

import { historyData } from '../../constants/historyData';
import { useState, useEffect, useRef } from 'react';

export const HistoryTimeline = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const scrollPosition = container.scrollTop;
            const sectionHeight = container.clientHeight;
            const newIndex = Math.round(scrollPosition / sectionHeight);
            
            setActiveIndex(Math.min(newIndex, historyData.length - 1));
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div 
            ref={containerRef}
            className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black relative"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            
            {/* 背景装飾 */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* 年号表示（サイド固定） */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 z-20">
                <div className="text-9xl font-bold bg-gradient-to-b from-white/20 to-white/5 bg-clip-text text-transparent select-none transition-all duration-700">
                    {historyData[activeIndex].year}
                </div>
                <div className="mt-8 relative">
                    {/* 縦線 */}
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50" />
                    
                    {historyData.map((event, index) => (
                        <div 
                            key={index}
                            className="relative flex items-center gap-4 group cursor-pointer mb-6 last:mb-0"
                            onClick={() => {
                                if (containerRef.current) {
                                    containerRef.current.scrollTo({
                                        top: index * containerRef.current.clientHeight,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                        >
                            {/* インジケーター */}
                            <div className="relative">
                                <div 
                                    className={`w-6 h-6 rounded-full transition-all duration-500 relative ${
                                        index === activeIndex 
                                            ? 'bg-gradient-to-br from-purple-400 to-blue-500 scale-110' 
                                            : 'bg-gray-700 group-hover:bg-gray-600'
                                    }`}
                                    style={{
                                        boxShadow: index === activeIndex 
                                            ? '0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)' 
                                            : 'none'
                                    }}
                                >
                                    {index === activeIndex && (
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 animate-ping opacity-75" />
                                    )}
                                </div>
                            </div>
                            
                            {/* 年号ラベル */}
                            <div 
                                className={`transition-all duration-500 ${
                                    index === activeIndex 
                                        ? 'text-white font-bold text-lg' 
                                        : 'text-gray-500 text-sm group-hover:text-gray-400'
                                }`}
                            >
                                {event.year}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* タイムラインコンテンツ */}
            {historyData.map((event, index) => (
                <div 
                    key={event.id}
                    className="h-screen snap-start flex items-center justify-center px-8 relative"
                >
                    <div 
                        className={`max-w-4xl w-full transition-all duration-1000 ${
                            index === activeIndex 
                                ? 'opacity-100 translate-y-0 scale-100' 
                                : 'opacity-0 translate-y-20 scale-95'
                        }`}
                        style={{
                            transform: index === activeIndex 
                                ? 'perspective(1000px) rotateX(0deg)' 
                                : 'perspective(1000px) rotateX(10deg)',
                        }}
                    >
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* 画像エリア */}
                            <div 
                                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
                                style={{
                                    boxShadow: index === activeIndex 
                                        ? '0 25px 50px -12px rgba(139, 92, 246, 0.5)' 
                                        : 'none',
                                    transform: index === activeIndex 
                                        ? 'translateZ(50px) rotateY(-5deg)' 
                                        : 'translateZ(0px) rotateY(0deg)',
                                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                <img 
                                    src={event.image} 
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>

                            {/* テキストエリア */}
                            <div 
                                className="space-y-6"
                                style={{
                                    transform: index === activeIndex 
                                        ? 'translateZ(30px)' 
                                        : 'translateZ(0px)',
                                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                                }}
                            >
                                <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                                    <span className="text-purple-300 text-sm font-semibold">
                                        {event.year}
                                    </span>
                                </div>
                                <h2 className="text-5xl font-bold text-white leading-tight">
                                    {event.title}
                                </h2>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    {event.description}
                                </p>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="h-px bg-gradient-to-r from-purple-500 to-transparent w-16" />
                                    <span className="text-sm">MILESTONE {index + 1}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* スクロールヒント（最初のセクションのみ） */}
                    {index === 0 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                            <div className="text-white/50 text-sm text-center">
                                <div className="mb-2">Scroll Down</div>
                                <svg 
                                    className="w-6 h-6 mx-auto" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 9l-7 7-7-7" 
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

