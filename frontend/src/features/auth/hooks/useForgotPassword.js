import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constant';

export const useForgotPassword = () => {
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${BASE_URL}/forgot-password`, { emailId: data.emailId });
            setStatus({ type: 'success', message: 'A reset link has been sent to your email! Link expires in 15 mins.' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please check your email.' });
        } finally {
            setLoading(false);
        }
    };

    return { status, loading, onSubmit };
};
