import React from 'react';
import { useVerifyOtp, VerifyOtpForm } from '@/features/auth';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const VerifyOtp = () => {
    const {
        otp, 
        inputRefs, 
        emailId,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResend,
        error, 
        loading,
        resending
    } = useVerifyOtp();

    useDocumentTitle("Verify Account");

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-base-100">
            <div className="card w-full max-w-md bg-base-300 shadow-2xl border border-base-200">
                <div className="card-body items-center text-center p-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-6">
                        📩
                    </div>
                    <h2 className="card-title text-3xl font-black uppercase tracking-tighter mb-2">Verify Email</h2>
                    <p className="text-sm opacity-60 mb-8 font-medium">
                        Enter the 6-digit code sent to <br />
                        <span className="text-primary font-bold">{emailId}</span>
                    </p>

                    <VerifyOtpForm 
                        otp={otp}
                        inputRefs={inputRefs}
                        handleChange={handleChange}
                        handleKeyDown={handleKeyDown}
                        handlePaste={handlePaste}
                        handleVerify={handleVerify}
                        error={error}
                        loading={loading}
                    />

                    <p className="mt-8 text-sm opacity-60 font-medium">
                        Didn't receive code?{' '}
                        <button
                            type="button"
                            className={`text-primary font-black hover:underline ${resending && 'opacity-50 pointer-events-none'}`}
                            onClick={handleResend}
                        >
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
