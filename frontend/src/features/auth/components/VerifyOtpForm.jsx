import React from 'react';

export const VerifyOtpForm = ({
    otp, 
    inputRefs, 
    handleChange, 
    handleKeyDown, 
    handlePaste, 
    handleVerify, 
    error, 
    loading
}) => {
    return (
        <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
            <div className="flex gap-2 mb-8" onPaste={handlePaste}>
                {otp.map((data, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="w-12 h-14 text-center text-2xl font-black bg-base-100 border-2 border-base-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                        value={data}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                ))}
            </div>

            {error && (
                <div className={`text-sm mb-6 ${error.includes('sent') ? 'text-success' : 'text-error'} font-bold animate-fadeIn`}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary w-full rounded-2xl h-14 text-lg shadow-xl shadow-primary/20"
                disabled={loading || otp.some(v => v === '')}
            >
                {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                {loading ? 'Verifying...' : 'Verify Engine'}
            </button>
        </form>
    );
};
