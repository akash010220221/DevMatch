import React from 'react';
import { Link } from "react-router-dom";
import useDocumentTitle from '@/hooks/useDocumentTitle';

const PageNotFound = () => {
    useDocumentTitle("Page Not Found");
    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 text-center">
            {/* Visual Element */}
            <div className="relative mb-8">
                <h1 className="text-[120px] md:text-[200px] font-black text-primary opacity-10 leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-6xl" role="img" aria-label="Rocket Icon">🚀</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-md mx-auto">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Lost in Space?
                </h2>
                <p className="text-lg md:text-xl opacity-70 mb-10 leading-relaxed">
                    The page you are looking for seems to have drifted out of orbit. Don't worry, we'll help you get back to safety.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/" className="btn btn-primary btn-lg shadow-lg hover:-translate-y-1 transition duration-300 w-full sm:w-auto">
                        Return to Earth
                    </Link>
                    <Link to="/feed" className="btn btn-ghost btn-lg hover:bg-base-200 transition duration-300 w-full sm:w-auto">
                        View Feed
                    </Link>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10 animate-pulse duration-5000"></div>
        </div>
    );
};

export default PageNotFound;