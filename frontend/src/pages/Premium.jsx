import React, { useEffect, useState } from 'react'
import axios from "axios";
import { BASE_URL } from "@/utils/constant";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SimpleCheckIcon } from '@/utils/Icons';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Premium = () => {
    const [isPremium, setIsPremium] = useState(false);
    const user = useSelector((store) => store.user);

    useDocumentTitle("Premium");

    useEffect(() => {
        if (user) setIsPremium(user?.isPremium);
    }, [user])

    const handlePurchase = async (type) => {
        try {
            const order = await axios.post(BASE_URL + "/payment/create", {
                membershipType: type,
            }, {
                withCredentials: true,
            })

            const { amount, keyId, currency, notes, orderId } = order.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: 'devMatch Premium',
                description: 'Upgrade your experience',
                order_id: orderId,
                prefill: {
                    name: notes.firstName + " " + notes.lastName,
                    email: notes.emailId,
                    contact: '9999999999'
                },
                theme: {
                    color: '#641ae6'
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            BASE_URL + "/payment/verify",
                            response,
                            { withCredentials: true }
                        );

                        if (verifyRes.data.success) {
                            setIsPremium(true);
                        }
                    } catch (err) {
                        console.error("Payment verify error:", err);
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
        }
    }

    if (isPremium) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fadeIn">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center mb-8 shadow-2xl shadow-yellow-500/20 ring-4 ring-yellow-400/20">
                    <span className="text-5xl" role="img" aria-label="Crown icon">👑</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-base-content mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 bg-[length:200%_auto] animate-gradient text-glow-yellow">
                    Premium Member
                </h2>
                <p className="opacity-60 max-w-sm mx-auto text-lg leading-relaxed">
                    Welcome to the elite circle! You have unlocked all professional features and unlimited networking.
                </p>
                <Link to="/feed" className="btn btn-warning btn-lg mt-10 rounded-full px-12 shadow-xl hover:scale-105 transition-all text-sm font-black uppercase tracking-widest text-black/80">
                    Back to Feed
                </Link>
            </div>
        );
    }

    return (
        <div className='max-w-6xl mx-auto my-12 px-6 sm:px-10 pb-20 animate-fadeIn'>
            {/* Page Header */}
            <div className='mb-16 text-center'>
                <h1 className='text-4xl md:text-6xl font-black tracking-tighter text-base-content uppercase leading-none'>Go Premium</h1>
                <div className="h-1.5 w-24 bg-primary rounded-full mt-4 mx-auto"></div>
                <p className="text-sm md:text-lg opacity-50 font-bold uppercase tracking-[0.25em] mt-6">Unlock the full power of networking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Silver Plan */}
                <div className="group relative bg-base-300 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-base-200 hover:border-primary/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="text-8xl select-none" role="img" aria-label="Silver icon">🥈</span>
                    </div>

                    <div>
                        <div className="badge badge-primary font-black uppercase text-[10px] tracking-widest mb-4 py-3 px-4">Most Popular</div>
                        <h3 className="text-4xl font-black text-base-content mb-2 tracking-tight">Silver Plan</h3>
                        <p className="opacity-50 text-sm font-bold uppercase tracking-widest mb-8">Basic Premium Access</p>

                        <div className="space-y-4 mb-12">
                            {['Unlimited Feed Access', 'Custom Profile Badge', 'Priority in Discovery'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <SimpleCheckIcon className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm md:text-base font-medium opacity-80">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => handlePurchase("silver")}
                        className='btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all font-black uppercase text-xs tracking-widest h-16'
                    >
                        Activate Silver
                    </button>
                </div>

                {/* Gold Plan */}
                <div className="group relative bg-base-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-2 border-secondary/20 hover:border-secondary transition-all duration-500 flex flex-col justify-between overflow-hidden transform md:scale-105 z-10">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="text-8xl select-none" role="img" aria-label="Gold icon">🥇</span>
                    </div>

                    <div>
                        <div className="badge badge-secondary font-black uppercase text-[10px] tracking-widest mb-4 py-3 px-4 shadow-lg shadow-secondary/20">Elite Membership</div>
                        <h3 className="text-4xl font-black text-base-content mb-2 tracking-tight">Gold Plan</h3>
                        <p className="opacity-50 text-sm font-bold uppercase tracking-widest mb-8">Ultimate Experience</p>

                        <div className="space-y-4 mb-12">
                            {['Everything in Silver', 'Direct Chat Access', 'Personal Profile Boost', 'Premium Support'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <SimpleCheckIcon className="w-5 h-5 text-secondary shrink-0" />
                                    <span className="text-sm md:text-base font-medium opacity-80">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => handlePurchase("gold")}
                        className='btn btn-secondary btn-lg w-full rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1 active:scale-95 transition-all font-black uppercase text-xs tracking-widest h-16'
                    >
                        Activate Gold
                    </button>
                </div>
            </div>

            {/* Bottom Proof Section */}
            <div className="mt-24 text-center">
                <p className="text-xs font-black uppercase tracking-[0.4em] opacity-20 mb-8 underline underline-offset-8">Powered by Razorpay Secure Payments</p>
                <div className="flex justify-center gap-8 opacity-20 grayscale">
                    <span className="text-2xl font-black italic">VISA</span>
                    <span className="text-2xl font-black italic">Mastercard</span>
                    <span className="text-2xl font-black italic">UPI</span>
                </div>
            </div>
        </div>
    )
}

export default Premium;