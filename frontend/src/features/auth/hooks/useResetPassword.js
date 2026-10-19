import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/utils/constant';

export const useResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const onSubmit = async (data) => {
        const { newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: "Passwords do not match." });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${BASE_URL}/reset-password`, { token, newPassword });
            setStatus({ type: 'success', message: 'Password updated successfully! Transitioning to login...' });
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to reset password.' });
        } finally {
            setLoading(false);
        }
    };

    return { status, loading, onSubmit };
};
