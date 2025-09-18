// import React, { useState } from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { api } from "../Instance/api";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import Topbar from "../components/Topbar";

// export default function Signup() {

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
//     }

//     const handleSignup = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await api.post("auth/register", formData);
//             console.log("Registration Success:", response.data);
//             let token = response.data.token
//             console.log(token)

//             window.electronAPI.saveToken(token);

//             navigate("/chatbot");
//         } catch (error) {
//             console.error("Registration Error:", error.response?.data || error)
//         }
//     }



//     const handleGoogleSuccess = async (credentialResponse) => {
//         console.log("Google JWT Token:", credentialResponse.credential);

//         try {
//             const response = await api.get("auth/google", { token: credentialResponse.credential });

//             console.log("Google Auth Success:", response.data);
//         } catch (error) {

//             console.error(" Google Auth Error:", error);
//         }
//     };

//     return (
//         <div className=" bg-[#191919]">
//             <Topbar />
//             <div className="flex flex-col items-center justify-center w-full bg-[#191919] rounded-xl p-10 mt-3.5 ">
//                 <h1 className="text-3xl font-bold text-purple-600">AI Overlay</h1>

//                 <div className="flex items-center justify-center">
//                     <h1 className="text-2xl font-bold text-white mb-3">
//                         Create an account
//                     </h1>
//                 </div>

//                 {/* Work Email */}
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-white mb-1">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-[300px] text-white h-[40px] border border-white rounded-[8px] px-3 py-2 focus:ring-2 outline-none text-[14px]"
//                         placeholder="Enter your email"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-white mb-1">
//                         Username
//                     </label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-[300px] text-white h-[40px] text-[14px] border border-white rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                         placeholder="Enter a username"
//                     />
//                 </div>

//                 {/* Password */}
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-white mb-1">
//                         Password
//                     </label>
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="w-[300px] h-[40px] text-white text-[14px] border border-white rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
//                         placeholder="Enter your password"
//                     />
//                     <button
//                         type="button"
//                         className="absolute right-13 top-1/2 transform -translate-y-1/2 text-sm font-medium text-white hover:text-gray-300"
//                         onClick={() => setShowPassword(!showPassword)}
//                     >
//                         {showPassword ? "Hide" : "Show"}
//                     </button>
//                 </div>
//                 {/* Create Account Button */}
//                 <button onClick={handleSignup} className="cursor-pointer w-[300px] text-[14px] mt-1 bg-purple-600 text-white font-medium py-2 rounded-[8px] hover:bg-purple-500 transition">
//                     Create Free Account
//                 </button>

//                 {/* OR Divider */}
//                 <div className="flex items-center my-4">
//                     <div className="flex-grow border-t border-gray-300"></div>
//                     <span className="px-2 text-sm text-gray-400">OR</span>
//                     <div className="flex-grow border-t border-gray-300"></div>
//                 </div>

//                 {/* Continue with Google */}

//                 <button onClick={handleGoogleSuccess} className="cursor-pointer w-[300px] border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-[8px] hover:bg-gray-100 transition">
//                     <img
//                         src="https://www.svgrepo.com/show/475656/google-color.svg"
//                         alt="Google"
//                         className="w-5 h-5"
//                     />
//                     <span className="text-white font-medium text-[14px] ">Continue With Google</span>
//                 </button>


//                 {/* Footer */}
//                 <p className="text-[13px] text-gray-500 text-center mt-4">
//                     By creating an account, you agree to our{" "}
//                     <a href="#" className="text-[14px] text-purple-500 hover:underline">
//                         terms
//                     </a>{" "}
//                     and{" "}
//                     <a href="#" className="text-[14px] text-purple-500 hover:underline">
//                         privacy policy
//                     </a>
//                     .
//                 </p>

//                 {/* Already have an account */}
//                 <p className="text-[13px] text-white text-center mt-4 ">
//                     Already have an account?{" "}
//                     <Link to="/signin" className="text-[14px] text-purple-500 font-medium hover:underline">
//                         Sign in
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }







import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../Instance/api"; // Your configured API instance
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Topbar from "../components/Topbar";

// --- SVG ICONS ---
const EyeIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post("auth/register", formData);
            console.log("Registration Success:", response.data);
            const token = response.data.token;
            console.log("Token:", token);
            // window.electronAPI.saveToken(token); // Uncomment if using Electron
            navigate("/chatbot");
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("Google JWT Token:", credentialResponse?.credential);
        try {
            const response = await api.post("auth/google", { token: credentialResponse.credential });
            console.log("Google Auth Success:", response.data);
            navigate("/chatbot");
        } catch (error) {
            console.error("Google Auth Error:", error);
        }
    };

    return (
        <div className="bg-[#191919] text-white font-sans h-full">
            <Topbar />
            {/* <div className="flex items-center justify-center w-full min-h-[calc(100vh-64px)] p-4"> */}
            <div className="w-full h-full flex flex-col items-center justify-center  min-h-[calc(100vh-64px)] max-w-md bg-[#191919] rounded-2xl p-8 shadow-2xl">
                {/* <Topbar /> */}
                <h1 className="text-3xl font-bold text-purple-600">AI Overlay</h1>

                <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-white mb-3">
                        Create an account
                    </h1>
                </div>



                <form onSubmit={handleSignup} className="space-y-6 mt-1">
                    {/* Email */}
                    <div className="relative m">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] bg-[#1e1e1e] h-[40px] text-white border border-gray-600 rounded-lg px-6 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Username */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] bg-[#1e1e1e] text-white h-[40px] border border-gray-600 rounded-lg px-6 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-[300px] text-[14px] bg-[#1e1e1e] text-white h-[40px] border border-gray-600 rounded-lg px-6 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-5 top-9 text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Create Account */}
                    <button
                        type="submit"
                        className="w-full h-[40px] text-base font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:ring-opacity-50 cursor-pointer"
                    >
                        Create Free Account
                    </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* Google Login */}
                <button onClick={handleGoogleSuccess} className="w- flex items-center justify-center border border-gray-600 w-[300px] h-[40px] text-base font-semibold text-white rounded-lg cursor-pointer">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-7 h-7 pr-1.5"
                    />
                    <span className="text-white font-medium text-[14px] ">Continue With Google</span>
                </button>

                {/* Footer Links */}
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
            {/* </div> */}
        </div>
    );
}
