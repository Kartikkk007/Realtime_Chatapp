import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route } from "react-router-dom";
import { use, useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import {Loader} from "lucide-react"
import { Toaster } from "react-hot-toast";
 
const App = () => {
 const {authUser, checkAuth, isCheckingAuth} = useAuthStore(); 
 const {theme} = useThemeStore();

 useEffect(() => {
  checkAuth();
 }, [checkAuth]);

 console.log(authUser);

 if(isCheckingAuth && !authUser) return(
  <div className="flex items-center justify-center h-screen">
       <Loader className="size-10 animate-spin" />
</div>
 )

  return (
    <div data-theme={theme} className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <HomePage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <LoginPage />} />
      </Routes>
      <Toaster/>
    </div>
  );
};


export default App