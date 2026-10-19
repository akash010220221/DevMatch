import React from 'react';
import LeetCodeHeatmap from './LeetCodeHeatmap';
import GitHubHeatmap from './GitHubHeatmap';

const TechnicalActivity = ({ githubUsername, leetcodeUsername, isOwnProfile }) => {
    return (
        <div className="space-y-12 animate-fadeIn pt-12">
            <div className="grid grid-cols-1 gap-10">
                {leetcodeUsername ? (
                    <LeetCodeHeatmap username={leetcodeUsername} />
                ) : (
                    <div 
                        className={`p-10 bg-base-300/30 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-base-content/10 flex flex-col items-center justify-center text-center ${isOwnProfile ? 'group hover:border-primary/30 cursor-pointer' : ''} transition-all`}
                        onClick={() => isOwnProfile && (window.location.href = '/profile')}
                    >
                         <p className={`text-[10px] font-black uppercase tracking-widest opacity-30 ${isOwnProfile ? 'group-hover:opacity-100 group-hover:text-primary transition-all' : ''}`}>
                             {isOwnProfile ? 'Connect LeetCode Account' : 'LeetCode Not Connected'}
                         </p>
                    </div>
                )}
                
                {githubUsername ? (
                    <GitHubHeatmap username={githubUsername} />
                ) : (
                    <div 
                        className={`p-10 bg-base-300/30 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-base-content/10 flex flex-col items-center justify-center text-center ${isOwnProfile ? 'group hover:border-secondary/30 cursor-pointer' : ''} transition-all`}
                        onClick={() => isOwnProfile && (window.location.href = '/profile')}
                    >
                         <p className={`text-[10px] font-black uppercase tracking-widest opacity-30 ${isOwnProfile ? 'group-hover:opacity-100 group-hover:text-secondary transition-all' : ''}`}>
                             {isOwnProfile ? 'Connect GitHub Pulse' : 'GitHub Not Connected'}
                         </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicalActivity;
