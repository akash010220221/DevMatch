import React from 'react';
import { useSelector } from 'react-redux';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import ProfileCV from '@/features/profile/components/ProfileCV';

const Portfolio = () => {
    const user = useSelector((store) => store.user);
    useDocumentTitle(user ? `${user.firstName}'s Portfolio` : "Architecture Portfolio");

    if (!user) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full border border-dashed border-base-content/20 flex items-center justify-center animate-spin-slow">
                <div className="w-12 h-12 rounded-full border border-primary/40"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Authenticating Pulse...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100">
            <ProfileCV user={user} onEdit={() => window.location.href = '/profile'} />
        </div>
    );
};

export default Portfolio;
