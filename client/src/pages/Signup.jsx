
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { api } from "../Instance/api"; // Your configured API instance
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import Topbar from "../components/Topbar";

// const EyeIcon = ({ className }) => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className={className}
//     >
//         <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//         <circle cx="12" cy="12" r="3" />
//     </svg>
// );

// const EyeOffIcon = ({ className }) => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className={className}
//     >
//         <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//         <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//         <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
//         <line x1="2" x2="22" y1="2" y2="22" />
//     </svg>
// );

// export default function Signup({ setIsAuthenticated }) {
//     const [showPassword, setShowPassword] = useState(false);
//     const [formData, setFormData] = useState({
//         email: "",
//         name: "",
//         password: "",
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };


//     const handleSignup = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await api.post("auth/register", formData);
//             console.log("Registration Success:", response.data);
//             const token = response.data.token;

//             if (token) {
//                 console.log("Token:", token);

//                 window.electronAPI.saveToken(token);

//                 if (window.electronAPI && window.electronAPI.resizeWindow) {
//                     window.electronAPI.resizeWindow(400, 300, true);
//                 }

//                 setIsAuthenticated(true);

//                 navigate("/chatbot");
//             } else {
//                 console.error("Token not found in response");
//             }

//         } catch (error) {
//             console.error("Registration Error:", error.response?.data || error);
//         }
//     };

//     // Continue with google
//     const handleGoogleSignup = async () => {
//         try {
//             const result = await window.electronAPI.googleLogin();
//             console.log("Google login result:", result);

//             if (result && result.token) {
//                 await window.electronAPI.saveToken(result.token);

//                 if (window.electronAPI && window.electronAPI.resizeWindow) {
//                     window.electronAPI.resizeWindow(400, 300, true);
//                 }

//                 setIsAuthenticated(true);
//                 navigate("/chatbot");
//             } else {
//                 console.error("No token returned from Google login");
//             }
//         } catch (error) {
//             console.error("Google login failed:", error);
//         }
//     };


//     return (
//         <div className="bg-[#191919] text-white font-sans h-full">
//             <Topbar />

//             <div className="w-full h-full flex flex-col items-center justify-center  min-h-[calc(100vh-64px)] max-w-md bg-[#191919] rounded-2xl p-8 shadow-2xl">
//                 {/* <Topbar /> */}
//                 <h1 className="text-3xl font-bold text-purple-600">AI Overlay</h1>

//                 <div className="flex items-center justify-center">
//                     <h1 className="text-2xl font-bold text-white mb-3">
//                         Create an account
//                     </h1>
//                 </div>


//                 <form onSubmit={handleSignup} className="space-y-6 mt-1">
//                     {/* Email */}
//                     <div className="relative m">
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-[300px] text-[14px] bg-[#1e1e1e] h-[40px] text-white border border-gray-600 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
//                             placeholder="Enter your email"
//                             required
//                         />
//                     </div>

//                     {/* Username */}
//                     <div className="relative">
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="w-[300px] text-[14px] bg-[#1e1e1e] text-white h-[40px] border border-gray-600 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
//                             placeholder="Choose a username"
//                             required
//                         />
//                     </div>

//                     {/* Password */}
//                     <div className="relative">
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-[300px] text-[14px] bg-[#1e1e1e] text-white h-[40px] border border-gray-600 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
//                             placeholder="Enter your password"
//                             required
//                         />
//                         <button
//                             type="button"
//                             className="absolute right-5 top-9 text-gray-400 hover:text-white"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-5 h-5" />}
//                         </button>
//                     </div>

//                     {/* Create Account */}
//                     <button
//                         type="submit"
//                         className="text-[14px] w-full h-[40px] text-base font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:ring-opacity-50 cursor-pointer"
//                     >
//                         Create Free Account
//                     </button>
//                 </form>

//                 {/* OR Divider */}
//                 <div className="flex items-center my-6">
//                     <div className="flex-grow border-t border-gray-600"></div>
//                     <span className="px-4 text-sm text-gray-400">OR</span>
//                     <div className="flex-grow border-t border-gray-600"></div>
//                 </div>

//                 <button
//                     onClick={handleGoogleSignup}
//                     className="w- flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
//                     <img
//                         src="https://www.svgrepo.com/show/475656/google-color.svg"
//                         alt="Google"
//                         className="w-7 h-7 pr-1.5"
//                     />
//                     <span className="text-white font-medium text-[14px] ">Continue With Google</span>
//                 </button>


//                 <p className="text-xs text-gray-500 text-center mt-8">
//                     By creating an account, you agree to our{" "}
//                     <Link to="#" className="text-purple-400 hover:underline">terms</Link> and{" "}
//                     <Link to="#" className="text-purple-400 hover:underline">privacy policy</Link>.
//                 </p>

//                 <p className="text-sm text-gray-300 text-center mt-4">
//                     Already have an account?{" "}
//                     <Link to="/signin" className="text-purple-400 font-medium hover:underline">Sign in</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }







import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../Instance/api";
import Topbar from "../components/Topbar";
import PopupNotification from "../components/PopupNotification";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Signup({ setIsAuthenticated }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", name: "", password: "" });
    const [notification, setNotification] = useState({ message: "", type: "error" });
    const [loadingSignup, setLoadingSignup] = useState(false);


    const navigate = useNavigate();
    const showError = (message) => setNotification({ message, type: "error" });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (event) => {
        event.preventDefault();
        setLoadingSignup(true)

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showError("Invalid email format");
            return;
        }

        try {
            const response = await api.post("auth/register", formData);
            const token = response.data.token;

            if (token) {
                await window.electronAPI.saveToken(token);
                if (window.electronAPI?.resizeWindow) window.electronAPI.resizeWindow(400, 300, true);
                setIsAuthenticated(true);
                navigate("/chatbot");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Registration failed";
            if (msg.includes("exists")) showError("User already exists");
            else showError(msg);
        } finally {
            setLoadingSignup(false)
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await window.electronAPI.googleLogin();
            if (result?.token) {
                await window.electronAPI.saveToken(result.token);
                if (window.electronAPI?.resizeWindow) window.electronAPI.resizeWindow(400, 300, true);
                setIsAuthenticated(true);
                navigate("/chatbot");
            }
        } catch (error) {
            showError("Google login failed");
        }
    };

    return (
        <div className="bg-[#191919] text-white font-sans h-full">
            <Topbar />

            {notification.message && (
                <PopupNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "error" })}
                />
            )}

            <div className="w-full h-full flex flex-col items-center justify-center min-h-[calc(100vh-64px)] max-w-md bg-[#191919] rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-purple-500">AI Overlay</h1>
                <h1 className="text-2xl font-bold text-white mb-3">Create an account</h1>

                <form onSubmit={handleSignup} className="space-y-6 mt-1">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] bg-[#1e1e1e] h-[40px] text-white border border-gray-600 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] bg-[#1e1e1e] text-white h-[40px] border border-gray-600 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] bg-[#1e1e1e] text-white h-[40px] border border-gray-600 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-6 top-9 text-gray-400 hover:text-white cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaRegEyeSlash className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-[300px] text-[14px] h-[40px] cursor-pointer text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700 mt-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={loadingSignup}
                    >
                     {loadingSignup ? "Creating Account..." : "Create Free Account"}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-7 h-7 pr-1.5" />
                    <span className="text-white font-medium text-[14px]">Continue With Google</span>
                </button>

                <p className="text-xs text-gray-500 text-center mt-8">
                    By creating an account, you agree to our{" "}
                    <Link to="#" className="text-purple-400 hover:underline">terms</Link> and{" "}
                    <Link to="#" className="text-purple-400 hover:underline">privacy policy</Link>.
                </p>

                <p className="text-sm text-gray-300 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-purple-400 font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}



