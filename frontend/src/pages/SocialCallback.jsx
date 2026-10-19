import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '@/utils/userSlice';
import axios from 'axios';
import { BASE_URL } from '@/utils/constant';

/**
 * SocialCallback - Handles the OAuth redirect from the backend.
 * Extracts the token from the URL, exchanges it for a httpOnly cookie
 * via a same-origin POST request, and redirects to the feed.
 */
const SocialCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError('Authentication failed. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!token) {
            setError('No token received. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        const exchangeToken = async () => {
            try {
                const res = await axios.post(
                    `${BASE_URL}/auth/social/exchange`,
                    { token },
                    { withCredentials: true }
                );
                dispatch(addUser(res.data));
                navigate('/feed', { replace: true });
            } catch (err) {
                setError('Session verification failed. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        exchangeToken();
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="card bg-base-300 shadow-2xl p-10 text-center max-w-sm w-full">
                {error ? (
                    <>
                        <div className="text-error text-4xl mb-4">✕</div>
                        <p className="text-error font-bold">{error}</p>
                        <p className="text-xs opacity-50 mt-2">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <span className="loading loading-spinner loading-lg text-primary mx-auto mb-4"></span>
                        <p className="font-bold text-lg">Authenticating...</p>
                        <p className="text-xs opacity-50 mt-2">Verifying your session</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SocialCallback;
