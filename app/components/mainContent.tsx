'use client';

import { CountUpAnimation } from './animation/count/countUpAnimation';
import { MemberLists } from './memberLists';
import { HistoryTimeline } from './timeline/historyTimeline';
import { LogoCube } from './cube/logoCube';
import { useState } from 'react';

export const MainContent = () => {
    const [showContent, setShowContent] = useState(false);

    if (!showContent) {
        return <CountUpAnimation onComplete={() => setShowContent(true)} />;
    }

    return (
        <>
            <LogoCube />
            <MemberLists />
            <HistoryTimeline />
        </>
    );
};

