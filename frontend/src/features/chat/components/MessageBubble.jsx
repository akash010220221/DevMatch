import React from 'react';

export const MessageBubble = React.memo(({ msg, isSender, userPhotoUrl, targetUserPhotoUrl, onImageLoad, onImageClick }) => {
    const resolveFileName = () => {
        if (msg.fileName) return msg.fileName;
        if (!msg.fileUrl) return "file";
        try {
            const pathname = new URL(msg.fileUrl).pathname;
            return decodeURIComponent(pathname.split("/").pop() || "file");
        } catch {
            return "file";
        }
    };

    return (
        <div className={"chat " + (isSender ? "chat-end" : "chat-start") + " group animate-fadeInUp"}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-xl shadow-lg ring-2 ring-base-100 ring-offset-2 ring-offset-base-300 overflow-hidden bg-base-300">
                    <img src={(isSender ? userPhotoUrl : targetUserPhotoUrl) || "/default-avatar.png"} alt="avatar" loading="lazy" />
                </div>
            </div>
            <div className={"chat-header mb-1 mx-2 flex items-center gap-2 " + (msg.status === "pending" ? "opacity-40" : "")}>
                <span className='text-[10px] font-black uppercase tracking-widest opacity-40'>
                    {isSender ? "You" : `${msg.firstName}`}
                </span>
                <time className="text-[9px] opacity-20 font-bold group-hover:opacity-60 transition-opacity flex items-center gap-1">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    {isSender && (
                        <span className="scale-75 translate-y-[-1px]">
                            {msg.status === "pending" && <span className="loading loading-spinner w-3 h-3"></span>}
                            {msg.status === "error" && <span className="text-error text-[10px] font-black">X</span>}
                        </span>
                    )}
                </time>
            </div>
            <div className={"chat-bubble py-3 px-5 shadow-xl leading-relaxed text-sm md:text-base transition-all " +
                (isSender
                    ? `bg-primary text-white rounded-br-none font-medium ${msg.status === "pending" && msg.messageType === "text" ? "opacity-70 animate-pulse" : ""} ${msg.status === "error" ? "border-2 border-error !bg-error/10 text-error" : ""}`
                    : "bg-base-300 text-base-content rounded-bl-none border border-base-200")}>
                
                {msg.messageType === "image" ? (
                    <div className="relative group/img my-1">
                        <img 
                            src={msg.fileUrl?.startsWith("blob:") 
                                ? msg.fileUrl 
                                : msg.fileUrl?.replace("/upload/", "/upload/w_600,c_limit,q_auto,f_auto/")
                            } 
                            alt="Shared media" 
                            className="rounded-xl max-w-full sm:max-w-[18rem] cursor-zoom-in hover:brightness-110 transition-all duration-500 shadow-2xl border border-white/10"
                            onLoad={onImageLoad}
                            onClick={() => msg.fileUrl && onImageClick?.(msg.fileUrl)}
                        />
                        {msg.status === "pending" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-xl border border-white/20">
                                <span className="loading loading-spinner text-white w-8 h-8"></span>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest mt-2 drop-shadow-md">Optimizing</p>
                            </div>
                        )}
                    </div>
                ) : msg.messageType === "file" ? (
                    <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 underline underline-offset-2 break-all"
                    >
                        <span>Download</span>
                        <span>{resolveFileName()}</span>
                    </a>
                ) : (
                    msg.text
                )}
            </div>
        </div>
    );
});

MessageBubble.displayName = "MessageBubble";
