import React, { Suspense, lazy } from "react";
import { Route, Routes } from 'react-router-dom'
import Body from "./Body";

// Lazy-loaded page components (code-split per route)
const Landing = lazy(() => import("./pages/Landing"));
const Feed = lazy(() => import("./pages/Feed"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Connections = lazy(() => import("./pages/Connections"));
const Requests = lazy(() => import("./pages/Requests"));
const Premium = lazy(() => import("./pages/Premium"));
const Chat = lazy(() => import("./pages/Chat"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SocialCallback = lazy(() => import("./pages/SocialCallback"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

/**
 * Premium Page Loader:
 * Displayed when fetching new lazy chunks.
 * Features a branded identity with glassmorphism and micro-animations.
 */
const PageLoader = () => (
  <div className="flex h-[80vh] w-full items-center justify-center p-4">
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Animation Ring Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute h-24 w-24 rounded-full border-t-2 border-primary/20 animate-spin-slow"></div>
        {/* Core spinner */}
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
      </div>

      {/* Branded Label */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-base-content/10 select-none">
          dev<span className="text-primary italic">M</span>atch
        </h2>
        
        {/* Animated status message */}
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 animate-pulse">
          Syncing Professional Experience...
        </p>
      </div>

      {/* Progress shadow background */}
      <div className="w-48 h-1 bg-base-content/5 rounded-full overflow-hidden absolute bottom-1/4 opacity-10 blur-sm"></div>
    </div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/chat/:targetUserId" element={<Chat />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/social-callback" element={<SocialCallback />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App;