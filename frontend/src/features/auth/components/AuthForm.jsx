import React from 'react';

export const AuthForm = ({ 
    isLogin, 
    register, 
    handleSubmit, 
    errors, 
    onSubmit, 
    loading, 
    error, 
    successMessage, 
    navigate 
}) => {
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="firstName" className="label text-xs uppercase font-bold tracking-widest opacity-60">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            className={`input input-bordered w-full focus:input-primary ${errors.firstName && "input-error"}`}
                            placeholder="John"
                            {...register("firstName", { required: !isLogin && "First name is required" })}
                        />
                        {errors.firstName && <span className="text-[10px] text-error mt-1 font-bold">{errors.firstName.message}</span>}
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="label text-xs uppercase font-bold tracking-widest opacity-60">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            className={`input input-bordered w-full focus:input-primary ${errors.lastName && "input-error"}`}
                            placeholder="Doe"
                            {...register("lastName", { required: !isLogin && "Last name is required" })}
                        />
                        {errors.lastName && <span className="text-[10px] text-error mt-1 font-bold">{errors.lastName.message}</span>}
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="emailId" className="label text-xs uppercase font-bold tracking-widest opacity-60">Email Address</label>
                <input
                    id="emailId"
                    type="email"
                    className={`input input-bordered w-full focus:input-primary ${errors.emailId && "input-error"}`}
                    placeholder="developer@example.com"
                    {...register("emailId", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address"
                        }
                    })}
                />
                {errors.emailId && <span className="text-[10px] text-error mt-1 font-bold">{errors.emailId.message}</span>}
            </div>

            <div>
                <label htmlFor="password" className="label text-xs uppercase font-bold tracking-widest opacity-60">Password</label>
                <input
                    id="password"
                    type="password"
                    className={`input input-bordered w-full focus:input-primary ${errors.password && "input-error"}`}
                    placeholder="••••••••"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Minimum 8 characters" }
                    })}
                />
                {errors.password && <span className="text-[10px] text-error mt-1 font-bold">{errors.password.message}</span>}
                {isLogin && (
                    <div className="text-right mt-1">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                        >
                            Forgot Password?
                        </button>
                    </div>
                )}
            </div>

            {successMessage && !error && (
                <div className="mt-6 bg-success/10 text-success text-sm p-3 rounded-lg border border-success/20 text-center font-bold">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="mt-6 bg-error/10 text-error text-sm p-3 rounded-lg border border-error/20 text-center animate-pulse">
                    {error}
                </div>
            )}

            <div className="card-actions mt-10">
                <button
                    type="submit"
                    className="btn btn-primary w-full text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 h-14"
                    disabled={loading}
                >
                    {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                    {loading ? (isLogin ? "Authenticating..." : "Creating Profile...") : (isLogin ? "Unlock Your Dashboard" : "Join the Community")}
                </button>
            </div>
        </form>
    );
};
