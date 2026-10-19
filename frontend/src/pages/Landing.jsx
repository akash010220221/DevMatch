import React from 'react';
import { useSelector } from 'react-redux';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { Hero, FeatureShowcase, TechMarquee, LandingCTA } from '@/features/landing';

const Landing = () => {
    useDocumentTitle("Join the Elite");
    const user = useSelector((store) => store.user);

    return (
        <div className="bg-base-100 min-h-screen">
            <Hero user={user} />
            
            <TechMarquee />

            <FeatureShowcase />

            <LandingCTA />
        </div>
    );
};

export default Landing;
