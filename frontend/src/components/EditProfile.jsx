import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import axios from "axios";
import { BASE_URL } from '@/utils/constant';
import { addUser } from '@/utils/userSlice';
import { CheckIcon } from '@/utils/Icons';
import { useForm } from "react-hook-form";
import imageCompression from 'browser-image-compression';

const EditProfile = ({ user }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age || "",
            photoUrl: user.photoUrl,
            about: user.about,
            gender: user.gender || "male",
            githubUsername: user.githubUsername || "",
            leetcodeUsername: user.leetcodeUsername || "",
            linkedinUrl: user.linkedinUrl || "",
            portfolioUrl: user.portfolioUrl || "",
            headline: user.headline || "Full Stack Developer",
            about: user.about || "",
            skills: user.skills?.join(", ") || ""
        }
    });

    // Watch all fields for the live preview
    const watchedFields = watch();

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (!imageFile) return;

        setUploading(true);
        setError(null);

        try {
            // Compression options
            const options = {
                maxSizeMB: 0.3, // 300KB
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(imageFile, options);

            // Prepare form data for upload
            const formData = new FormData();
            formData.append('profilePhoto', compressedFile);

            const res = await axios.post(BASE_URL + "/profile/upload", formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update the form field with the new URL
            setValue("photoUrl", res.data.photoUrl, { shouldValidate: true });

        } catch (err) {
            setError(err?.response?.data?.message || "Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        setError(null);
        try {
            const { skills, ...rest } = data;
            // Process skills string back into an array
            const skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0);

            const res = await axios.patch(BASE_URL + "/profile/edit", {
                ...rest,
                skills: skillsArray
            }, {
                withCredentials: true,
            })
            dispatch(addUser(res?.data?.data))

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
        } catch (err) {
            setError(err?.response?.data || "Something went wrong while saving.")
        }
    }

    const ProfilePreview = () => (
        <div className='w-full flex flex-col items-center gap-6 md:gap-10 my-8 lg:my-0 lg:sticky lg:top-10'>
            <div className="flex items-center gap-3 opacity-30">
                <span className="h-px w-8 bg-current"></span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Live Feed View</span>
                <span className="h-px w-8 bg-current"></span>
            </div>
            <div className="scale-[0.85] sm:scale-95 md:scale-100 origin-top hover:scale-[1.03] transition-all duration-500 w-full flex justify-center">
                <Card
                    user={{
                        ...watchedFields,
                        skills: watchedFields.skills ? watchedFields.skills.split(",").map(s => s.trim()).filter(s => s) : []
                    }}
                    isPreview={true}
                />
            </div>
        </div>
    );

    return (
        <div className="pb-20 animate-fadeIn overflow-x-hidden">
            <div className='flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 lg:gap-20 my-6 md:my-10 max-w-7xl mx-auto px-4 sm:px-10 leading-relaxed'>

                {/* Form Section */}
                <div className='w-full lg:w-3/5 max-w-2xl'>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-base-300 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-base-200">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-base-content uppercase">Edit Profile</h2>
                            <div className="h-1.5 w-20 bg-primary rounded-full mt-2 mx-auto lg:mx-0"></div>
                            <p className="text-xs md:text-sm opacity-50 font-bold uppercase tracking-[0.2em] mt-4">Personal Dashboard</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="form-control w-full">
                                <label htmlFor="firstName" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">First Name</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.firstName && "input-error"}`}
                                    placeholder="John"
                                    {...register("firstName", { required: "First name is required" })}
                                />
                                {errors.firstName && <span className="text-[10px] text-error mt-1 font-bold">{errors.firstName.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label htmlFor="lastName" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Last Name</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.lastName && "input-error"}`}
                                    placeholder="Doe"
                                    {...register("lastName", { required: "Last name is required" })}
                                />
                                {errors.lastName && <span className="text-[10px] text-error mt-1 font-bold">{errors.lastName.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label htmlFor="age" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Age</span>
                                </label>
                                <input
                                    id="age"
                                    type="number"
                                    min="18" max="99"
                                    className={`input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all ${errors.age && "input-error"}`}
                                    placeholder="25"
                                    {...register("age", { required: "Age is required", min: 18, max: 99 })}
                                />
                                {errors.age && <span className="text-[10px] text-error mt-1 font-bold">{errors.age.message}</span>}
                            </div>

                            <div className="form-control w-full">
                                <label htmlFor="gender" className="label py-1 mb-1">
                                    <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Gender</span>
                                </label>
                                <select
                                    id="gender"
                                    className="select select-bordered w-full h-14 rounded-2xl focus:select-primary bg-base-200/50 border-base-200 text-base font-medium transition-all"
                                    {...register("gender")}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Only: Insert Preview here */}
                        <div className="lg:hidden">
                            <ProfilePreview />
                        </div>

                        <div className="form-control w-full mt-6">
                            <label className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Profile Photo</span>
                            </label>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-base-200/50 rounded-3xl border border-dashed border-base-content/20 hover:border-primary/50 transition-all">
                                <div className="avatar">
                                    <div className="w-24 h-24 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                                        <img 
                                            src={watchedFields.photoUrl || "https://lh3.googleusercontent.com/gg-dl/AOI_d_9lNh-NJt7RMMQ_sdGcdX0SjSAZGuPmfGNV__K62GBYOBoCYFPh9fkNhQSoMgVfkKo7tdygxHK6O5PL3wHWd4JOidzBri5W0xsj1UXGjkorqn9wUiBwWYKKATss6Evw0RKtyAv5eU791ezPxkAjhv16qa2XwO3231yqpAqNyKfXuGVM=s1024-rj"} 
                                            alt="Profile Preview" 
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-1 w-full space-y-3">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            id="photoUpload"
                                            type="file"
                                            accept="image/*"
                                            className="file-input file-input-bordered file-input-primary w-full h-12 rounded-xl text-sm"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        <p className="text-[10px] opacity-50 font-bold uppercase tracking-wider pl-1">
                                            {uploading ? "Uploading to Cloudinary..." : "Max size 300KB • JPG, PNG, WEBP"}
                                        </p>
                                    </div>
                                    
                                    {/* Keep photoUrl as hidden register to maintain form state */}
                                    <input type="hidden" {...register("photoUrl", { required: "Profile photo is required" })} />
                                </div>
                            </div>
                            {errors.photoUrl && <span className="text-[10px] text-error mt-1 font-bold">{errors.photoUrl.message}</span>}
                        </div>

                        <div className="mt-10 p-8 bg-base-200/30 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex items-center gap-3 opacity-40 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Handles</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label htmlFor="githubUsername" className="label py-0">
                                        <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">GitHub Username</span>
                                    </label>
                                    <input
                                        id="githubUsernameInput"
                                        type="text"
                                        className="input input-bordered w-full h-12 rounded-xl focus:input-primary bg-base-100/50 border-base-200 text-sm font-medium transition-all"
                                        placeholder="octocat"
                                        {...register("githubUsername")}
                                    />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="leetcodeUsername" className="label py-0">
                                        <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">LeetCode Username</span>
                                    </label>
                                    <input
                                        id="leetcodeUsernameInput"
                                        type="text"
                                        className="input input-bordered w-full h-12 rounded-xl focus:input-secondary bg-base-100/50 border-base-200 text-sm font-medium transition-all"
                                        placeholder="leet_coder"
                                        {...register("leetcodeUsername")}
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label htmlFor="linkedinUrl" className="label py-0">
                                        <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">LinkedIn URL</span>
                                    </label>
                                    <input
                                        id="linkedinUrlInput"
                                        type="text"
                                        className="input input-bordered w-full h-12 rounded-xl focus:input-primary bg-base-100/50 border-base-200 text-sm font-medium transition-all"
                                        placeholder="https://linkedin.com/in/username"
                                        {...register("linkedinUrl")}
                                    />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="portfolioUrl" className="label py-0">
                                        <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">Portfolio URL</span>
                                    </label>
                                    <input
                                        id="portfolioUrlInput"
                                        type="text"
                                        className="input input-bordered w-full h-12 rounded-xl focus:input-secondary bg-base-100/50 border-base-200 text-sm font-medium transition-all"
                                        placeholder="https://my-awesome-site.com"
                                        {...register("portfolioUrl")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-control w-full mt-10">
                            <label htmlFor="skills" className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Technical Stacks / Skills</span>
                            </label>
                            <input
                                id="skills"
                                type="text"
                                className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all"
                                placeholder="React, Node.js, Python, AWS... (comma-separated)"
                                {...register("skills")}
                            />
                        </div>

                        <div className="form-control w-full mt-10">
                            <label htmlFor="headline" className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">Current Position / Professional Role</span>
                            </label>
                            <input
                                id="headline"
                                type="text"
                                className="input input-bordered w-full h-14 rounded-2xl focus:input-primary bg-base-200/50 border-base-200 text-base font-medium transition-all"
                                placeholder="e.g. Frontend Developer, Cloud Engineer"
                                {...register("headline", { required: "Headline is required" })}
                            />
                        </div>

                        <div className="form-control w-full mt-10">
                            <label htmlFor="about" className="label py-1 mb-1">
                                <span className="label-text text-xs font-black uppercase opacity-60 tracking-wider">About Your Journey</span>
                            </label>
                            <textarea
                                id="about"
                                className={`textarea textarea-bordered w-full h-40 rounded-3xl focus:textarea-primary bg-base-200/50 border-base-200 text-base font-medium transition-all p-5 ${errors.about && "textarea-error"}`}
                                placeholder="Tell other developers about your stacks, goals, and what you're building..."
                                {...register("about", { required: "About section is required" })}
                            />
                            {errors.about && <span className="text-[10px] text-error mt-1 font-bold">{errors.about.message}</span>}
                        </div>

                        {error && (
                            <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg w-full h-16 mt-12 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all text-sm font-black uppercase tracking-[0.2em]">
                            Push Update
                        </button>
                    </form>
                </div>

                {/* Desktop/Tablet Only: Render Preview on side */}
                <div className="hidden lg:block lg:w-2/5">
                    <ProfilePreview />
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="toast toast-top toast-center z-[100]">
                    <div className="alert alert-success shadow-2xl border-none text-white font-extrabold py-5 px-10 rounded-[2rem] animate-bounce">
                        <CheckIcon className="stroke-current shrink-0 h-6 w-6" />
                        <span className="tracking-tight">Profile has been updated!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditProfile