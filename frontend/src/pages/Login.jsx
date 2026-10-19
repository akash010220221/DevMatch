import React from 'react';
import { useAuth, AuthTabs, AuthForm, SocialLogin } from '@/features/auth';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Login = () => {
    const {
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
    } = useAuth();

    useDocumentTitle(isLogin ? "Login | Secure Access" : "Join devMatch | Create Account");

    return (
        <div className='flex items-center justify-center min-h-[80vh] px-4 py-10 bg-base-100'>
            <div className="card w-full max-w-md bg-base-300 shadow-2xl overflow-hidden border border-base-200">
                <div className="card-body p-8">
                    <div className='text-center mb-8'>
                        <h1 className="text-4xl font-extrabold text-primary mb-2">devMatch</h1>
                        <p className="text-sm opacity-70 italic">Discover your next co-builder</p>
                    </div>

                    <AuthTabs isLogin={isLogin} toggleMode={toggleMode} />

                    <AuthForm 
                        isLogin={isLogin} 
                        register={register} 
                        handleSubmit={handleSubmit} 
                        errors={errors} 
                        onSubmit={onSubmit} 
                        loading={loading} 
                        error={error} 
                        successMessage={successMessage} 
                        navigate={navigate} 
                    />

                    <SocialLogin />

                    <div className="text-center mt-6">
                        <p className='text-sm opacity-60'>
                            {isLogin ? "New here?" : "Already a member?"}
                            <button
                                type="button"
                                className="ml-2 text-primary font-bold hover:underline"
                                onClick={toggleMode}
                            >
                                {isLogin ? "Create an account" : "Log in now"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
