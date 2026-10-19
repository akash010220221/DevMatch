import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/features/auth';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const ForgotPassword = () => {
    useDocumentTitle("Account Recovery");
    const { status, loading, onSubmit: submitHandler } = useForgotPassword();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { emailId: '' }
    });

    const onSubmit = (data) => submitHandler(data);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-base-100">
            <div className="card w-full max-w-md bg-base-300 shadow-2xl border border-base-200">
                <div className="card-body p-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group transition-transform duration-500 hover:scale-110">
                        🔑
                    </div>
                    <h2 className="card-title text-4xl font-black uppercase tracking-tighter mb-4">Reset Hub</h2>
                    <p className="text-sm opacity-60 mb-10 font-medium leading-relaxed">
                        Enter your registered email address below, and we'll dispatch a secure recovery link to your inbox.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="emailId" className="label text-[10px] font-black uppercase tracking-widest opacity-40">Email Address</label>
                            <input
                                id="emailId"
                                type="email"
                                className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-100/50 border-base-200 text-base font-medium transition-all ${errors.emailId && "input-error"}`}
                                placeholder="developer@example.com"
                                {...register("emailId", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.emailId && <p className="text-[10px] text-error mt-1 font-bold">{errors.emailId.message}</p>}
                        </div>

                        {status.message && (
                            <div className={`text-sm p-4 rounded-xl border font-bold animate-fadeIn ${status.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full rounded-2xl h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                            {loading ? 'Transmitting...' : 'Send Recovery Link'}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <Link to="/login" className="text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-primary transition-all">
                            &larr; Return to Central Hall
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
