import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

const theme = {
  dark: ['#505050ff', '#1b7c12', '#35c20c', '#0cea26', '#16f930'],
};

export default function GitHubHeatmap({ username }) {
    if (!username) {
        return (
            <div className="bg-base-200/50 border border-white/5 rounded-3xl p-8 text-center text-[10px] font-black uppercase tracking-widest opacity-20">
                GitHub Handle Missing
            </div>
        );
    }

    return (
        <div className="bg-base-300/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-success/20 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-success/60">GitHub Contributions</p>
                <div className="px-3 py-1 bg-success/10 text-success text-[8px] font-black rounded-full uppercase tracking-widest animate-pulse">Live Sync</div>
            </div>

            <div className="overflow-x-auto overflow-y-hidden scrollbar-none pb-2">
                <div className="min-w-[700px]">
                    <GitHubCalendar
                        username={username}
                        colorScheme="dark"
                        blockSize={12}
                        blockMargin={4}
                        blockRadius={3}
                        fontSize={11}
                        theme={theme}
                        hideColorLegend
                        labels={{ totalCount: '{{count}} contributions' }}
                    />
                </div>
            </div>
        </div>
    );
}
