// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { api } from "../Instance/api";
// import { useState } from "react";
// import Topbar from "../components/Topbar";


// export default function Signin() {

//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });


//     const handleChange = (event) => {
//         setFormData((prev) => ({
//             ...prev,
//             [event.target.name]: event.target.value,
//         }));
//     };

//     const handleLogin = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await api.post("auth/login", formData);
//             console.log("Login Success:", response.data);

//             const token = response.data.token;  
//             if (token) {
//                 await window.electronAPI.saveToken(token);  
//                 console.log("Token saved to keytar:", token);
//                 navigate("/chatbot");
//             } else {
//                 console.error("Login Error: Token not found in response");
//             }

//         } catch (error) {
//             console.error("Login Error:", error.response?.data || error);
//         }
//     }

//     return (
//         <div className=" bg-white">
//             {/* <Topbar /> */}
//             <div className="flex flex-col items-center justify-center w-full bg-white rounded-xl p-10 mt-7">

//                 <h1 className="text-purple-600 text-3xl font-bold justify-items-start">AI Overlay</h1>

//                 <h1 className="text-2xl font-bold text-gray-700 mb-3">
//                     Sign in to your account
//                 </h1>

//                 <div className="mb-4 mt-4">
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-[300px] h-[40px] text-[14px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                         placeholder="Enter your email"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Password
//                     </label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="w-[300px] text-[14px] border border-gray-400 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                         placeholder="Enter your password"
//                     />
//                 </div>

//                 <button onClick={handleLogin} className="cursor-pointer w-[300px] text-[14px] mt-4 bg-purple-600 text-white font-medium py-2 rounded-[8px] hover:bg-purple-500 transition">
//                     Sign in
//                 </button>

//                 <div className="flex items-center my-4">
//                     <div className="flex-grow border-t border-gray-300"></div>
//                     <span className="px-2 text-sm text-gray-400">OR</span>
//                     <div className="flex-grow border-t border-gray-300"></div>
//                 </div>

//                 <button className="cursor-pointer w-[300px] text-[14px] border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-[8px] hover:bg-gray-100 transition">
//                     <img
//                         src="https://www.svgrepo.com/show/475656/google-color.svg"
//                         alt="Google"
//                         className="w-5 h-5"
//                     />
//                     <span className="text-gray-700 font-medium text-[14px]">Continue With Google</span>
//                 </button>

//                 <p className="text-[13px] text-gray-500 text-center mt-4">
//                     By creating an account, you agree to our{" "}
//                     <a href="#" className="text-[14px] text-purple-600 hover:underline">
//                         terms
//                     </a>{" "}
//                     and{" "}
//                     <a href="#" className="text-[14px] text-purple-500 hover:underline">
//                         privacy policy
//                     </a>
//                     .
//                 </p>

//                 <p className="text-[13px] text-center mt-4">
//                     Don't have an account?{" "}
//                     <Link to="/signup" className="text-purple-500 font-medium hover:underline text-[14px]" >
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
// import { Link } from "lucide-react";
// import Link from "react-router-dom"

// Mock replacements for router and API (remove if using real imports)
// const Link = ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;
// const useNavigate = () => (path) => console.log(`Navigating to ${path}`);



// --- SVG ICONS ---
const EyeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

export default function Signin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("auth/login", formData);
            console.log("Login Success:", response.data);
            const token = response.data.token;
            if (token) {
                console.log("Token received:", token);
                navigate("/chatbot");
            } else console.error("Token not found");
        } catch (err) {
            console.error("Login Error:", err.message || err);
        }
    };

    return (
        // <div className="min-h-screen text-white font-sans bg-[#121212] bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        //   <Topbar />
        <div className="bg-[#191919] flec flex-col items-center justify-center w-full h-full">
            <Topbar />
            <div className="flex flex-col items-center justify-center w-full h-full  bg-[#191919] border rounded-2xl p-8 ">
                <h1 className="text-3xl font-bold text-center text-purple-500 mb-2 mt-7">AI Overlay</h1>
                <h2 className="text-2xl font-semibold text-center text-white mb-8">Sign in to your account</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] h-[40px] bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-[300px] text-[14px] h-[40px] bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />
                            {/* <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button> */}
                        </div>
                    </div>

                    {/* Sign In */}
                    <button
                        type="submit"
                        className="w-[300px] text-[14px] h-[40px] text-base font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700 mt-3"
                    >
                        Sign In
                    </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-700" />
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-700" />
                </div>

                {/* Continue with Google */}
                <button onClick={handleGoogleSuccess} className="w- flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-7 h-7 pr-1.5"
                    />
                    <span className="text-white font-medium text-[14px] ">Continue With Google</span>
                </button>

                {/* Footer */}
                <p className="text-sm text-gray-300 text-center mt-8">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-400 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
        // </div>
    );
}



