import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@/utils/Icons';

export const LandingCTA = () => {
    return (
        <div className="bg-base-100 py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <div className="max-w-4xl mx-auto bg-base-300 p-16 md:p-28 rounded-[4rem] border-4 border-base-content/5 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] group-hover:bg-primary/40 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-secondary/20 blur-[100px] group-hover:bg-secondary/40 transition-colors"></div>
                    
                    <h2 className="text-5xl md:text-8xl font-black text-base-content mb-8 tracking-tightest uppercase leading-none">The Engine is <span className="text-secondary">Ready.</span></h2>
                    
                    <p className="text-xl opacity-60 mb-16 max-w-xl mx-auto leading-relaxed font-bold">
                        Join the fastest-growing community of builders. Stop searching, start matching.
                    </p>

                    <Link to="/login" state={{ signup: true }} className="btn btn-primary btn-lg rounded-3xl px-16 h-20 group relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity animate-gradient bg-[length:200%_auto]"></div>
                        <span className="relative z-10 text-sm font-black uppercase tracking-[0.4em]">INITIATE SEQUENCE</span>
                        <ArrowRightIcon className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Minimalist Grid Pattern Background */}
                    <div className="absolute inset-0 -z-10 opacity-5 grid-pattern"></div>
                </div>
            </div>
        </div>
    );
};
