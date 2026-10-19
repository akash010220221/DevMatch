import { AppLogo, GithubIcon, LinkedinIcon, CodeIcon, GlobeIcon, MailIcon } from '@/utils/Icons';

const Footer = () => {
    return (
        <footer className="bg-base-300/50 backdrop-blur-xl border-t border-base-content/5 py-20 px-6 lg:px-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-16 items-start">
                    {/* Brand Column */}
                    <div className="space-y-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5">
                                <AppLogo width={32} height={32} className="fill-primary animate-pulse" />
                            </div>
                            <span className="text-4xl font-black tracking-tightest uppercase text-base-content">
                                dev<span className="text-primary italic">M</span>atch
                            </span>
                        </div>
                        <p className="opacity-50 text-base leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                            The elite ecosystem for modern developers. Discover co-founders, swap tech stacks, and scale your professional circle with clinical precision.
                        </p>
                    </div>

                    {/* Architect & Socials Column (Latest Sketch-aligned) */}
                    <div className="flex flex-col items-center md:items-start gap-8">
                        {/* Section Header per sketch */}
                        <div className="w-fit">
                            <h6 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">The Architect</h6>
                            <div className="h-0.5 w-full bg-secondary/30 mt-1 opacity-50"></div>
                        </div>

                        <div className="flex items-start gap-8 group">
                            {/* Profile Image - Large Rounded Rectangle per sketch */}
                            <div className="w-32 h-40 rounded-[2.5rem] bg-base-content/5 overflow-hidden border border-base-content/10 transition-all duration-700 shadow-2xl group-hover:border-primary/30 shrink-0">
                                <img src="https://nirajkumar.vercel.app/assets/profileImg-Dg_W4rk-.jpg" alt="Akash Kumar" className="w-full h-full object-cover" />
                            </div>

                            {/* Info Stack */}
                            <div className="flex flex-col gap-5 justify-center py-2">
                                <div>
                                    <h6 className="text-3xl font-black uppercase tracking-tightest leading-tight text-base-content">
                                        Akash Kumar
                                    </h6>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mt-1">Full Stack Engineer</p>
                                </div>

                                {/* Circular Links - Single Horizontal Row per sketch */}
                                <div className="flex flex-row gap-3 pt-2">
                                    <a 
                                        href="https://github.com/akash010220221" 
                                        target="_blank" 
                                        className="w-11 h-11 rounded-full bg-base-content/5 hover:bg-primary/20 hover:text-primary border border-base-content/10 hover:border-primary/20 flex items-center justify-center transition-all duration-500 group shadow-lg"
                                        title="GitHub"
                                    >
                                        <GithubIcon width={20} height={20} className="fill-current group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a 
                                        href="https://linkedin.com/in/akash0102" 
                                        target="_blank" 
                                        className="w-11 h-11 rounded-full bg-base-content/5 hover:bg-secondary/20 hover:text-secondary border border-base-content/10 hover:border-secondary/20 flex items-center justify-center transition-all duration-500 group shadow-lg"
                                        title="LinkedIn"
                                    >
                                        <LinkedinIcon width={20} height={20} className="fill-current group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a 
                                        href="mailto:akashkrsingh1104@gmail.com" 
                                        className="w-11 h-11 rounded-full bg-base-content/5 hover:bg-success/20 hover:text-success border border-base-content/10 hover:border-success/20 flex items-center justify-center transition-all duration-500 group shadow-lg"
                                        title="Email Me"
                                    >
                                        <MailIcon width={20} height={20} className="text-current group-hover:scale-110 transition-transform" />
                                    </a>
                                    <a 
                                        href="https://krakash.tech" 
                                        target="_blank" 
                                        className="w-11 h-11 rounded-full bg-base-content/5 hover:bg-accent/20 hover:text-accent border border-base-content/10 hover:border-accent/20 flex items-center justify-center transition-all duration-500 group shadow-lg"
                                        title="Portfolio"
                                    >
                                        <GlobeIcon width={20} height={20} className="text-current group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-12 border-t border-base-content/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">
                        <CodeIcon className="h-4 w-4" />
                        Built with Clinical Precision for Developers
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
                        Copyright © {new Date().getFullYear()} devMatch Network
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
