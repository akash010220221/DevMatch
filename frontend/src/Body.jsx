import React, { Suspense, lazy, useEffect } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from './utils/userSlice'
import { useGetProfileQuery } from './utils/apiSlice'
import { connectSocket, disconnectSocket } from './utils/socket'

const NotificationListener = lazy(() => import('./features/notifications/NotificationListener'))
const VideoCallProvider = lazy(() =>
    import('./features/chat/context/VideoCallContext').then((module) => ({
        default: module.VideoCallProvider
    }))
)
const VideoCallPortal = lazy(() => import('./features/chat/VideoCallPortal'))

const AUTH_PUBLIC_PATHS = ["/login", "/verify-otp", "/forgot-password", "/reset-password"];
const FOOTER_PATHS = ["/", ...AUTH_PUBLIC_PATHS];
const SAFE_401_PATHS = ["/", ...AUTH_PUBLIC_PATHS];

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((store) => store.user);

    const isAuthPublicPath = AUTH_PUBLIC_PATHS.includes(location.pathname);
    const { data: profile, error } = useGetProfileQuery(undefined, {
        skip: isAuthPublicPath,
    });

    useEffect(() => {
        if (profile) {
            dispatch(addUser(profile));
            if (location.pathname === "/") {
                navigate("/feed");
            }
        }
    }, [profile, dispatch, location.pathname, navigate]);

    useEffect(() => {
        if (error?.status === 401 && !SAFE_401_PATHS.includes(location.pathname)) {
            navigate("/login");
            disconnectSocket();
        }
    }, [error, location.pathname, navigate]);

    // Socket lifecycle
    useEffect(() => {
        if (userData) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [userData]);

    const showFooter = FOOTER_PATHS.includes(location.pathname);

    // Inner content wrapped conditionally with VideoCallProvider
    const content = (
        <>
            <Navbar />
            {userData && (
                <Suspense fallback={null}>
                    <NotificationListener />
                </Suspense>
            )}
            <main className="flex-1">
                <Outlet />
            </main>
            {showFooter && <Footer />}
        </>
    );

    return (
        <div className="flex flex-col min-h-screen">
            {userData ? (
                <Suspense fallback={content}>
                    <VideoCallProvider>
                        <VideoCallPortal />
                        {content}
                    </VideoCallProvider>
                </Suspense>
            ) : (
                content
            )}
        </div>
    )
}

export default Body
