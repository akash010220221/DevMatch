import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "@/utils/constant";
import axios from "axios";
import { removeUser } from "@/utils/userSlice";
import { apiSlice, useGetNotificationsQuery, useMarkNotificationsAsReadMutation } from "@/utils/apiSlice";
import { SunIcon, MoonIcon, BellIcon } from "@/utils/Icons";

const Navbar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const { data: notifData } = useGetNotificationsQuery({}, {
        skip: !user
    });
    const [markAsRead] = useMarkNotificationsAsReadMutation();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, {
                withCredentials: true,
            })
        } catch (err) {
            console.error("Logout error on server:", err);
        } finally {
            dispatch(apiSlice.util.resetApiState());
            dispatch(removeUser());
        }
    }

    const navLinks = [
        { name: 'Feed', path: '/feed' },
        { name: 'Connections', path: '/connections' },
        { name: 'Requests', path: '/requests' },
    ];

    return (
        <div className="navbar bg-base-300/80 backdrop-blur-md sticky top-0 z-[100] px-4 md:px-8 border-b border-base-200/50 h-20 transition-all duration-300">
            {/* Left Section: Logo */}
            <div className="flex-1">
                <Link to={user ? "/feed" : "/"} className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white font-black text-xl italic">dm</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-base-content hidden sm:block">
                        devMatch
                    </span>
                </Link>
            </div>

            {/* Center Section: Navigation Links (Desktop Only) */}
            {user && (
                <div className="hidden lg:flex items-center gap-2 bg-base-100 rounded-2xl p-1.5 border border-base-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === link.path
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "hover:bg-base-200 opacity-60 hover:opacity-100"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Right Section: Actions */}
            <div className="flex-none flex items-center gap-3 ml-4">
                {/* Theme Toggle */}
                <button
                    onClick={handleThemeToggle}
                    className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary transition-colors"
                >
                    {theme === "dark" ? (
                        <SunIcon className="w-6 h-6 fill-current" />
                    ) : (
                        <MoonIcon className="w-6 h-6 fill-current" />
                    )}
                </button>

                {/* Notification Bell */}
                {user && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative hover:bg-base-200 transition-all">
                            <BellIcon className="w-6 h-6 opacity-60 hover:opacity-100" />
                            {notifData?.totalUnread > 0 && (
                                <span className="absolute top-2 right-2 h-4 w-4 bg-error text-[8px] font-black flex items-center justify-center rounded-full text-white ring-2 ring-base-300 animate-bounce">
                                    {notifData.totalUnread > 9 ? '9+' : notifData.totalUnread}
                                </span>
                            )}
                        </div>
                        <div tabIndex={0} className="dropdown-content mt-4 z-[101] p-0 shadow-2xl bg-base-300 rounded-[1.5rem] w-80 border border-base-200 overflow-hidden ring-1 ring-white/5">
                            <div className="p-4 bg-base-100/50 flex justify-between items-center border-b border-base-200">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Alerts</h3>
                                {notifData?.totalUnread > 0 && (
                                    <button 
                                        onClick={() => markAsRead()}
                                        className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {!notifData?.notifications?.length ? (
                                    <div className="p-10 text-center opacity-20">
                                        <BellIcon className="w-10 h-10 mx-auto mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Inbox is empty</p>
                                    </div>
                                ) : (
                                    notifData.notifications.map((notif) => (
                                        <Link 
                                            to={notif.type === "NEW_MESSAGE" ? `/chat/${notif.sender._id}` : "/requests"}
                                            key={notif._id} 
                                            className={`flex gap-3 p-4 hover:bg-base-100 transition-all border-b border-base-200/50 last:border-0 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="avatar h-10 w-10 shrink-0">
                                                <div className="rounded-xl overflow-hidden shadow-md">
                                                    <img src={notif.sender?.photoUrl || "/default-avatar.png"} alt="sender" loading="lazy" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-xs font-black text-base-content leading-tight">
                                                    {notif.sender?.firstName} {notif.sender?.lastName}
                                                </p>
                                                <p className="text-[10px] font-medium opacity-60 line-clamp-1 italic text-base-content">
                                                    {notif.type === "CONNECTION_REQUEST" && "Invited you to connect"}
                                                    {notif.type === "REQUEST_ACCEPTED" && "Accepted your invitation"}
                                                    {notif.type === "NEW_MESSAGE" && "Sent you a message"}
                                                </p>
                                                <span className="text-[8px] font-bold opacity-30 mt-1">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {!notif.isRead && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 ml-auto shrink-0"></div>
                                            )}
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {user ? (
                    <div className="flex items-center gap-1">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-none mb-1">Developer</span>
                            <span className="text-sm font-black text-base-content leading-none">
                                {user.firstName}
                            </span>
                        </div>

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar p-0.5 ring-2 ring-transparent hover:ring-primary transition-all duration-300">
                                <div className="w-10 rounded-xl overflow-hidden shadow-lg border-2 border-base-100">
                                    <img alt="profile" src={user?.photoUrl || "/default-avatar.png"} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[101] p-3 shadow-2xl bg-base-300 rounded-[1.5rem] w-60 border border-base-200">
                                <div className="px-4 py-3 border-b border-base-200 mb-2">
                                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Signed in as</p>
                                    <p className="text-sm font-black truncate">{user.firstName} {user.lastName}</p>
                                </div>
                                <li className="lg:hidden"><Link to="/feed" className="py-3 font-bold">Feed</Link></li>
                                <li className="lg:hidden"><Link to="/connections" className="py-3 font-bold">Connections</Link></li>
                                <li className="lg:hidden"><Link to="/requests" className="py-3 font-bold">Requests</Link></li>
                                <li><Link to="/portfolio" className="py-3 font-bold">Portfolio</Link></li>
                                <li><Link to="/profile" className="py-3 font-bold">Account Settings</Link></li>
                                <li><Link to="/premium" className="py-3 font-bold text-primary italic">Upgrade to Gold</Link></li>
                                <div className="divider my-1 opacity-50"></div>
                                <li><Link to="/login" onClick={handleLogout} className="py-3 font-bold text-error hover:bg-error/10">Sign Out</Link></li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-primary btn-sm md:btn-md rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-primary/20">Sign In</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;