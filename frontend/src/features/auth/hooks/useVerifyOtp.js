import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '@/utils/constant';

export const useVerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    const emailId = location.state?.emailId;

    useEffect(() => {
        if (!emailId) {
            navigate('/login');
        }
    }, [emailId, navigate]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newOtp = [...otp];
        data.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        const nextIndex = data.length < 6 ? data.length : 5;
        if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
    };

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(
                `${BASE_URL}/verify-otp`,
                { emailId, otp: otpValue },
                { withCredentials: true }
            );
            navigate('/login', { state: { message: 'Account verified! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            await axios.post(`${BASE_URL}/resend-otp`, { emailId });
            setError('New OTP sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return {
        otp, setOtp,
        error, setError,
        loading, setLoading,
        resending, setResending,
        inputRefs,
        emailId,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResend
    };
};
