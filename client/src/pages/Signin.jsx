
// import React, { useState } from "react";
// import { api } from "../Instance/api";
// import { useNavigate, Link } from "react-router-dom";
// import Topbar from "../components/Topbar";

// const EyeIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//         <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//         <circle cx="12" cy="12" r="3" />
//     </svg>
// );

// const EyeOffIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//         <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//         <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//         <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
//         <line x1="2" x2="22" y1="2" y2="22" />
//     </svg>
// );

// export default function Signin() {
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = useState(false);
//     const [formData, setFormData] = useState({ email: "", password: "" });

//     const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await api.post("auth/login", formData);
//             console.log("Login Success:", response.data);
//             const token = response.data.token;

//             if (token) {
//                 console.log("Token received:", token);

//                 window.electronAPI.saveToken(token);

//                 if (window.electronAPI && window.electronAPI.resizeWindow) {
//                     window.electronAPI.resizeWindow(400, 300, true);
//                 }

//                 navigate("/chatbot");
//             } else console.error("Token not found");
//         } catch (err) {
//             console.error("Login Error:", err.message || err);
//         }
//     };


//     const handleGoogleLogin = async () => {
//         try {
//             const result = await window.electronAPI.googleLogin();
//             console.log("Google login result:", result);

//             if (result && result.token) {
//                 await window.electronAPI.saveToken(result.token);

//                 if (window.electronAPI && window.electronAPI.resizeWindow) {
//                     window.electronAPI.resizeWindow(400, 300, true);
//                 }

//                 navigate("/chatbot");
//             } else {
//                 console.error("No token returned from Google login");
//             }
//         } catch (error) {
//             console.error("Google login failed:", error);
//         }
//     };

//     return (
//         <div className="bg-[#191919] flex-col items-center justify-center w-full h-full">
//             <Topbar />
//             <div className="flex flex-col items-center justify-center w-full h-full  bg-[#191919] p-8 ">
//                 <h1 className="text-3xl font-bold text-center text-purple-500 mb-2 mt-7">AI Overlay</h1>
//                 <h2 className="text-2xl font-semibold text-center text-white mb-[33px]">Sign in to your account</h2>

//                 <form onSubmit={handleLogin} className="space-y-6 mt-6">
//                     {/* Email */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-[300px] text-[14px] h-[40px] bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
//                             placeholder="you@example.com"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 className="w-[300px] text-[14px] h-[40px] bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
//                                 placeholder="Enter your password"
//                                 required
//                             />

//                          <button
//                             type="button"
//                             className="absolute right-5 top-2 text-gray-400 hover:text-white"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                         </button>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-[300px] text-[14px] h-[40px] cursor-pointer text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700 mt-3"
//                     >
//                         Sign In
//                     </button>
//                 </form>

//                 <div className="flex items-center my-8">
//                     <div className="flex-grow border-t border-gray-700" />
//                     <span className="px-4 text-sm text-gray-400">OR</span>
//                     <div className="flex-grow border-t border-gray-700" />
//                 </div>

//                 <button
//                     onClick={handleGoogleLogin}
//                     className="w- flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
//                     <img
//                         src="https://www.svgrepo.com/show/475656/google-color.svg"
//                         alt="Google"
//                         className="w-7 h-7 pr-1.5"
//                     />
//                     <span className="text-white font-medium text-[14px] ">Continue With Google</span>
//                 </button>

//                 <p className="text-sm text-gray-300 text-center mt-13">
//                     Don't have an account?{" "}
//                     <Link to="/signup" className="text-purple-400 font-medium hover:underline">
//                         Sign up
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }



import React, { useState } from "react";
import { api } from "../Instance/api";
import { useNavigate, Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import PopupNotification from "../components/PopupNotification";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Signin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [notification, setNotification] = useState({ message: "", type: "error" });
    
    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [forgotData, setForgotData] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showError = (message) => setNotification({ message, type: "error" });
    const showSuccess = (message) => setNotification({ message, type: "success" });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("auth/login", formData);
            const token = response.data.token;

            if (token) {
                await window.electronAPI.saveToken(token);
                if (window.electronAPI?.resizeWindow) window.electronAPI.resizeWindow(400, 300, true);
                navigate("/chatbot");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed";
            if (msg.includes("User does not exist")) showError("User does not exist");
            else if (msg.toLowerCase().includes("password")) showError("Incorrect password");
            else showError(msg);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await window.electronAPI.googleLogin();
            if (result?.token) {
                await window.electronAPI.saveToken(result.token);
                if (window.electronAPI?.resizeWindow) window.electronAPI.resizeWindow(400, 300, true);
                navigate("/chatbot");
            } else showError("Google login failed");
        } catch (err) {
            showError("Google login failed");
        }
    };

    // Forgot Password Functions
    const handleForgotPasswordStep1 = async (e) => {
        e.preventDefault();
        try {
            await api.post("auth/forgot-password", { email: forgotData.email });
            showSuccess("OTP sent to your email");
            setForgotStep(2);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send OTP";
            showError(msg);
        }
    };

    const handleForgotPasswordStep2 = async (e) => {
        e.preventDefault();
        try {
            await api.post("auth/verify-otp", { email: forgotData.email, otp: forgotData.otp });
            showSuccess("OTP verified successfully");
            setForgotStep(3);
        } catch (err) {
            const msg = err.response?.data?.message || "Invalid OTP";
            showError(msg);
        }
    };

    const handleForgotPasswordStep3 = async (e) => {
        e.preventDefault();
        
        if (forgotData.newPassword !== forgotData.confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        if (forgotData.newPassword.length < 6) {
            showError("Password must be at least 6 characters long");
            return;
        }

        try {
            await api.post("auth/reset-password", {
                email: forgotData.email,
                otp: forgotData.otp,
                newPassword: forgotData.newPassword
            });
            showSuccess("Password reset successfully");
            setShowForgotModal(false);
            setForgotStep(1);
            setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to reset password";
            showError(msg);
        }
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    };

    const handleForgotDataChange = (e) => {
        setForgotData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="bg-[#191919] flex-col items-center justify-center w-full h-full">
            <Topbar />

            {notification.message && (
                <PopupNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "error" })}
                />
            )}

            <div className="flex flex-col items-center justify-center w-full h-full bg-[#191919] p-8">
                <h1 className="text-3xl font-bold text-center text-purple-500 mb-2 mt-5">AI Overlay</h1>
                <h1 className="text-2xl font-bold text-center text-white mb-[30px]">Sign in to your account</h1>

                <form onSubmit={handleLogin} className="space-y-6 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] h-[40px] text-white border border-gray-700 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-[300px] text-[14px] h-[40px] text-white border border-gray-700 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-6 top-3 text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaRegEyeSlash className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="text-right mt-2">
                            <button
                                type="button"
                                onClick={() => setShowForgotModal(true)}
                                className="text-sm text-purple-400 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-[300px] text-[14px] h-[40px] cursor-pointer text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700 mt-3"
                    >
                        Sign In
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-700" />
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-700" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-7 h-7 pr-1.5"
                    />
                    <span className="text-white font-medium text-[14px] ">Continue With Google</span>
                </button>

                <p className="text-sm text-gray-300 text-center mt-10">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-400 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2a2a2a] p-8 rounded-lg w-[400px] border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                {forgotStep === 1 && "Reset Password"}
                                {forgotStep === 2 && "Enter OTP"}
                                {forgotStep === 3 && "New Password"}
                            </h3>
                            <button
                                onClick={closeForgotModal}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Step 1: Enter Email */}
                        {forgotStep === 1 && (
                            <form onSubmit={handleForgotPasswordStep1}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Enter your email address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={forgotData.email}
                                        onChange={handleForgotDataChange}
                                        className="w-full text-[14px] h-[40px] bg-[#191919] text-white border border-gray-700 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full h-[40px] text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700"
                                >
                                    Send OTP
                                </button>
                            </form>
                        )}

                        {/* Step 2: Enter OTP */}
                        {forgotStep === 2 && (
                            <form onSubmit={handleForgotPasswordStep2}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Enter the OTP sent to your email
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={forgotData.otp}
                                        onChange={handleForgotDataChange}
                                        className="w-full text-[14px] h-[40px] bg-[#191919] text-white border border-gray-700 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep(1)}
                                        className="flex-1 h-[40px] text-base font-semibold text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 h-[40px] text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700"
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Enter New Password */}
                        {forgotStep === 3 && (
                            <form onSubmit={handleForgotPasswordStep3}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={forgotData.newPassword}
                                            onChange={handleForgotDataChange}
                                            className="w-full text-[14px] h-[40px] bg-[#191919] text-white border border-gray-700 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Enter new password"
                                            minLength="6"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <FaRegEyeSlash className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={forgotData.confirmPassword}
                                            onChange={handleForgotDataChange}
                                            className="w-full text-[14px] h-[40px] bg-[#191919] text-white border border-gray-700 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Confirm new password"
                                            minLength="6"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaRegEyeSlash className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep(2)}
                                        className="flex-1 h-[40px] text-base font-semibold text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 h-[40px] text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}