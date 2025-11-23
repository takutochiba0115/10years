'use client';

import { CountUpAnimation } from './animation/count/countUpAnimation';
import { MemberLists } from './memberLists';
import { HistoryTimeline } from './timeline/historyTimeline';
import { useState } from 'react';

export const MainContent = () => {
    const [showContent, setShowContent] = useState(false);

    if (!showContent) {
        return <CountUpAnimation onComplete={() => setShowContent(true)} />;
    }

    return (
        <>
            <MemberLists />
            <HistoryTimeline />
        </>
    );
};

