import React from 'react';

export const AuthTabs = ({ isLogin, toggleMode }) => {
    return (
        <div className="flex border-b border-base-200 mb-6 font-semibold">
            <button
                type="button"
                className={`flex-1 py-3 transition-all duration-300 ${isLogin ? "text-primary border-b-4 border-primary" : "opacity-50 hover:opacity-100"}`}
                onClick={() => !isLogin && toggleMode()}
            >
                LOGIN
            </button>
            <button
                type="button"
                className={`flex-1 py-3 transition-all duration-300 ${!isLogin ? "text-primary border-b-4 border-primary" : "opacity-50 hover:opacity-100"}`}
                onClick={() => isLogin && toggleMode()}
            >
                SIGN UP
            </button>
        </div>
    );
};
