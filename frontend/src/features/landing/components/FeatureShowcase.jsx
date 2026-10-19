import React from 'react';

export const FeatureShowcase = () => {
    const features = [
        {
            title: "Algorithmic Discovery",
            desc: "Powered by a proprietary synergetic matching engine. Stop swiping, start collaborating. Find devs who complement your stack.",
            icon: "🧬",
            color: "primary",
            badge: "CORE ENGINE"
        },
        {
            title: "Optimistic Socket Engine",
            desc: "WhatsApp-grade real-time messaging with <50ms latency. Persistent history, direct-to-cloud media sharing via Cloudinary.",
            icon: "⚡",
            color: "secondary",
            badge: "REAL-TIME"
        },
        {
            title: "Premium Ecosystem",
            desc: "Unlock Gold Status. Unlimited connections, exclusive badges, and deeper insights into who's viewing your stack.",
            icon: "👑",
            color: "accent",
            badge: "MONETIZED"
        }
    ];

    return (
        <div className="py-24 md:py-32 bg-base-200/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6 underline underline-offset-8">Infrastructure</h2>
                    <h3 className="text-4xl md:text-6xl font-black tracking-tightest text-base-content uppercase leading-none">The Future of <br /> Collaborative Dev.</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="group p-10 bg-base-100 rounded-[3rem] border border-base-content/5 shadow-xl hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-700">
                            <div className="flex justify-between items-start mb-10">
                                <div className={`w-20 h-20 bg-${feature.color}/10 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                    {feature.icon}
                                </div>
                                <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border border-${feature.color}/20 text-${feature.color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                                    {feature.badge}
                                </span>
                            </div>
                            <h4 className="text-2xl font-black text-base-content mb-6 tracking-tight uppercase leading-none">{feature.title}</h4>
                            <p className="opacity-60 text-base leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
