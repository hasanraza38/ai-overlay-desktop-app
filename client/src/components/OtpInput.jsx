import React from "react";

const OtpInput = ({ length = 6, value = "", onChange }) => {
  const inputsRef = React.useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // sirf numbers
    if (!val) return;

    let otpArr = value.split("");
    otpArr[index] = val[0];
    const newOtp = otpArr.join("");
    onChange(newOtp);

    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-lg font-bold bg-[#1a1a1a] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200"
        />
      ))}
    </div>
  );
};


export default OtpInput;