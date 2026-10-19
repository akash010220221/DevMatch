import React from 'react';
import { AttachmentIcon, PaperPlaneIcon } from '@/utils/Icons';

export const ChatInput = ({ fileInputRef, handleFileUpload, isUploading, uploadError, newMessage, setNewMessage, sendMessage }) => {
    return (
        <div className='bg-base-300 p-4 md:p-6 border-t border-base-200'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-end gap-3 bg-base-100 rounded-[1.5rem] p-2 pr-3 border border-base-200 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all'>
                    <input
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className='btn btn-circle btn-ghost opacity-40 hover:opacity-100 hover:text-primary transition-all '
                        disabled={isUploading}
                    >
                        <AttachmentIcon className="w-6 h-6" />
                    </button>
                    <textarea
                        rows="1"
                        value={newMessage}
                        disabled={isUploading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isUploading ? "Uploading file..." : "Share a thought..."}
                        className='flex-1 bg-transparent border-none focus:outline-none py-3 px-2 text-base-content placeholder:opacity-30 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.2em] resize-none overflow-hidden max-h-32'
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!newMessage.trim() || isUploading}
                        className={`btn btn-circle btn-primary shadow-lg shadow-primary/20 transition-all duration-300 ${(!newMessage.trim() || isUploading) ? "opacity-20 scale-90" : "scale-110 active:scale-95"}`}
                    >
                        <PaperPlaneIcon className="w-5 h-5 translate-x-0.5" />
                    </button>
                </div>
                {uploadError && (
                    <p className="mt-2 px-2 text-xs text-error font-semibold">{uploadError}</p>
                )}
            </div>
        </div>
    );
};
