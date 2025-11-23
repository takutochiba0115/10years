'use client';

import { MemberInfo } from '../../constants/memberInfo';
import { useState, useMemo } from 'react';
import { selectColor } from '../../constants/selectColor';

type MemberCardProps = {
    member: MemberInfo;
};

export const MemberCard = ({ member }: MemberCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const neonColor = useMemo(() => {
        return selectColor[member.id % selectColor.length];
    }, [member.id]);

    return (
        <div
            className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`absolute inset-0 rounded-lg border border-gray-700 transition-opacity duration-300 z-20 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-100'}`} />

            <div
                className={`absolute inset-0 rounded-lg transition-opacity duration-300 z-20 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    border: `2px solid ${neonColor}`,
                    boxShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}, inset 0 0 10px ${neonColor}`,
                    animation: isHovered ? 'neon-pulse 2s ease-in-out infinite' : 'none',
                }}
            />
            <div
                className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                <p className="text-white text-lg font-semibold text-center">
                    {member.name}
                </p>
            </div>
        </div>
    );
};

