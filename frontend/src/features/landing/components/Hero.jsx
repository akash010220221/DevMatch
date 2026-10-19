import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@/utils/Icons';

export const Hero = ({ user }) => {
    return (
        <div className="relative isolate min-h-[95vh] flex flex-col justify-center overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] bg-accent/10 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-300 border border-base-content/5 mb-8 animate-fadeIn text-base-content">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Synthesizing Connections</span>
                        </div>

                        <h1 className="text-6xl lg:text-9xl font-black tracking-tightest leading-[0.85] mb-8 uppercase text-base-content">
                            Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent italic">Beyond</span> <br />
                            Limits.
                        </h1>

                        <p className="text-xl md:text-2xl opacity-60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-12">
                            The elite matchmaking engine for high-performance engineers. Find collaborators who share your stack, passion, and ambition.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                            {user ? (
                                <Link to="/feed" className="btn btn-primary btn-lg rounded-2xl shadow-2xl shadow-primary/30 h-16 px-12 group">
                                    <span className="text-sm font-black uppercase tracking-widest">Open Dashboard</span>
                                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" state={{ signup: true }} className="btn btn-primary btn-lg rounded-2xl shadow-2xl shadow-primary/20 h-16 px-10 text-sm font-black uppercase tracking-widest hover:-translate-y-1 transition-all">
                                        Join Ecosystem
                                    </Link>
                                    <Link to="/login" className="btn btn-ghost btn-lg rounded-2xl h-16 px-10 border-2 border-base-content/5 hover:bg-base-content/5 transition-all text-sm font-black uppercase tracking-widest">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="mt-16 flex items-center justify-center lg:justify-start gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-base-100 bg-base-300 bg-cover bg-center shadow-2xl transition-transform hover:-translate-y-2" style={{ backgroundImage: `url(https://i.pravatar.cc/150?u=dev${i})` }}></div>
                                ))}
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-black tracking-tighter leading-none">2,400+</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Engineers onboarded</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2 perspective-1000">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-secondary to-accent rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

                            {/* PREVIEW CARD: Real product visualization */}
                            <div className="relative w-full bg-base-300/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transform hover:rotate-1 hover:scale-[1.02] transition-all duration-700">
                                <div className="aspect-[4/5] md:aspect-auto md:h-[600px] w-full relative">
                                    {/* Mock Profile Image */}
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://nirajkumar.vercel.app/assets/profileImg-Dg_W4rk-.jpg')` }}></div>

                                    {/* Overlay Gradients */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-base-300/20 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-base-300/40 to-transparent"></div>

                                    {/* Top Bar Actions */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-lg shadow-error/20"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-lg shadow-warning/20"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-lg shadow-success/20"></div>
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                                            98% Match
                                        </div>
                                    </div>

                                    {/* Profile Details */}
                                    <div className="absolute bottom-8 left-8 right-8 z-20">
                                        <div className="mb-6">
                                            <h3 className="text-4xl font-black text-white tracking-tighter mb-1">AKASH KUMAR</h3>
                                            <div className="flex items-center gap-2 opacity-80">
                                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                                <p className="text-xs font-bold uppercase tracking-widest text-white">Full Stack Architect • India</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-white/70 font-medium mb-8 line-clamp-2 max-w-sm">
                                            Architecting real-time distributed systems. Building the future of developer networking at devMatch.
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-10">
                                            {['REACT.JS', 'NODE.JS', 'DOCKER', 'AWS', 'TYPESCRIPT'].map(skill => (
                                                <span key={skill} className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Pass</span>
                                            </div>
                                            <div className="flex-[2] h-14 rounded-2xl bg-primary shadow-xl shadow-primary/30 flex items-center justify-center">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Connect</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating IDE Snippet */}
                            <div className="absolute -top-12 -right-12 w-80 bg-base-300 rounded-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden hidden md:block animate-float">
                                <div className="bg-base-200 px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-error/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-warning/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-success/20"></div>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">MatchEngine.ts</span>
                                </div>
                                <div className="p-8">
                                    <pre className="text-[11px] leading-relaxed font-mono">
                                        <div className="flex gap-4">
                                            <span className="opacity-20 select-none">1</span>
                                            <code className="text-blue-400">const</code> <code>matchStatus = </code> <code className="text-purple-400">await</code>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="opacity-20 select-none">2</span>
                                            <code className="text-yellow-400">MatchEngine</code>.<code>exec</code>(&#123;
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="opacity-20 select-none">3</span>
                                            <span className="ml-4 opacity-70">target: </span> <code className="text-green-400">"Niraj Kumar"</code>,
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="opacity-20 select-none">4</span>
                                            <span className="ml-4 opacity-70">skills: </span> <code>[</code><code className="text-green-400">"Node.js"</code><code>, </code><code className="text-green-400">"React"</code><code>]</code>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="opacity-20 select-none">5</span>
                                            &#125;);
                                        </div>
                                    </pre>
                                </div>
                            </div>

                            {/* Stats Badge */}
                            <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl animate-float animation-delay-2000 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl">
                                        🚀
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-white leading-none mb-1">98.4%</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Collab Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
