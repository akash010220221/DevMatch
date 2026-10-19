import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '@/utils/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '@/utils/constant';
import { useForm } from 'react-hook-form';

export const useAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLogin, setIsLogin] = useState(!location.state?.signup);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            emailId: "",
            password: "",
            firstName: "",
            lastName: ""
        }
    });

    const successMessage = location.state?.message;

    const onSubmit = async (formData) => {
        setLoading(true);
        setError("");
        const endpoint = isLogin ? "login" : "signup";

        try {
            const res = await axios.post(`${BASE_URL}/${endpoint}`, formData, { withCredentials: true });

            if (isLogin) {
                dispatch(addUser(res.data));
                navigate("/feed");
            } else {
                navigate("/verify-otp", { state: { emailId: formData.emailId } });
            }
        } catch (err) {
            if (err?.response?.status === 403) {
                navigate("/verify-otp", { state: { emailId: formData.emailId } });
            } else {
                setError(err?.response?.data?.message || err?.response?.data || "Operation failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        reset(); 
    };

    return {
        isLogin,
        error,
        loading,
        successMessage,
        register,
        handleSubmit,
        errors,
        onSubmit,
        toggleMode,
        navigate
    };
};
