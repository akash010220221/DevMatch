import React from 'react';
import TechnicalActivity from './TechnicalActivity';
import { GithubIcon, LinkedinIcon, GlobeIcon, MailIcon, CodeIcon, LeetCodeIcon } from '@/utils/Icons';

const ProfileCV = ({ user, onEdit }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
            {/* CV Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* 1. LEFT SIDEBAR: Personal Branding & Identity */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Identity Card */}
                    <div className="p-8 bg-base-300/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10 group-hover:bg-primary/20 transition-colors"></div>
                        
                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-48 h-56 rounded-[2.5rem] overflow-hidden border-2 border-primary/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] mb-8 transform group-hover:scale-[1.02] transition-transform duration-700">
                                <img 
                                    src={user.photoUrl} 
                                    alt={user.firstName} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h1 className="text-4xl font-black uppercase tracking-tightest leading-none text-base-content mb-2">
                                {user.firstName} <br /> {user.lastName}
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-60 mb-2 italic">
                                {user.headline || "Software Engineer"}
                            </p>
                            
                            <p className="text-sm font-serif text-base-content/70 italic leading-relaxed mb-8 max-w-sm opacity-90 group-hover:opacity-100 transition-opacity">
                                "{user.about || "Architecting the future through clean code and scalable systems."}"
                            </p>

                            {/* Circular Social Links - Dynamic rendering */}
                            <div className="flex gap-3 mb-10">
                                {user.githubUsername && (
                                    <a href={`https://github.com/${user.githubUsername}`} target="_blank" className="w-10 h-10 rounded-full bg-base-content/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center border border-white/5 transition-all">
                                        <GithubIcon width={18} height={18} className="fill-current" />
                                    </a>
                                )}
                                {user.leetcodeUsername && (
                                    <a href={`https://leetcode.com/${user.leetcodeUsername}`} target="_blank" className="w-10 h-10 rounded-full bg-base-content/5 hover:bg-[#F7991C]/20 hover:text-[#F7991C] flex items-center justify-center border border-white/5 transition-all">
                                        <LeetCodeIcon width={18} height={18} className="fill-current" />
                                    </a>
                                )}
                                {user.linkedinUrl && (
                                    <a href={user.linkedinUrl} target="_blank" className="w-10 h-10 rounded-full bg-base-content/5 hover:bg-secondary/20 hover:text-secondary flex items-center justify-center border border-white/5 transition-all">
                                        <LinkedinIcon width={18} height={18} className="fill-current" />
                                    </a>
                                )}
                                {user.portfolioUrl && (
                                    <a href={user.portfolioUrl} target="_blank" className="w-10 h-10 rounded-full bg-base-content/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center border border-white/5 transition-all">
                                        <GlobeIcon width={18} height={18} className="text-current" />
                                    </a>
                                )}
                                <a href={`mailto:${user.emailId}`} className="w-10 h-10 rounded-full bg-base-content/5 hover:bg-success/20 hover:text-success flex items-center justify-center border border-white/5 transition-all">
                                    <MailIcon width={18} height={18} className="text-current" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Skills Matrix - Only if present */}
                    {user.skills?.length > 0 && (
                        <div className="p-8 bg-base-300/30 backdrop-blur-xl rounded-[2.5rem] border border-white/5 relative group/skills overflow-hidden">
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover/skills:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <CodeIcon width={16} height={16} className="text-primary" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/60">Core Stack</h3>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map(skill => (
                                    <span key={skill} className="px-5 py-2.5 bg-base-content/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-default transform hover:scale-110 active:scale-95 duration-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. MAIN CONTENT: Technical Proof & Activity */}
                <div className="lg:col-span-8">
                    {/* Integrated Heatmaps */}
                    <TechnicalActivity 
                        githubUsername={user.githubUsername} 
                        leetcodeUsername={user.leetcodeUsername} 
                        isOwnProfile={!!onEdit}
                    />

                    {/* Bottom Aesthetic Footer */}
                    <div className="flex justify-center opacity-20 pt-16">
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.6em]">
                            <div className="h-px w-20 bg-base-content"></div>
                            devMatch verified architect
                            <div className="h-px w-20 bg-base-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCV;
