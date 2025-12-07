'use client';

import { memberInfo } from '../constants/memberInfo';
import { MemberCard } from './card/memberCard';

export const MemberLists = () => {
    return (
        <div id="member-section" className="min-h-screen bg-black py-16 px-8">
            <div className="w-full mx-auto">
                <div className="grid grid-cols-4">
                    {memberInfo.map((member) => (
                        <MemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );
};

