import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/set-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md">
        <Logo subtitle="" showIcon={false} />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Verify OTP</h2>
            <p className="text-sm text-gray-500">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-[#111827]">name@enterprise.com</span>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => {
                return (
                  <input
                    className="w-12 h-12 border border-gray-200 rounded-lg text-center text-lg font-bold text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] outline-none transition-all"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onFocus={e => e.target.select()}
                  />
                );
              })}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#111827] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827] transition-colors"
            >
              Verify Code
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            
            <div className="pt-6 border-t border-gray-100 text-center space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                <button type="button" className="text-sm font-medium text-[#111827] hover:underline">
                  Resend Code
                </button>
              </div>
              
              <div className="flex justify-center">
                <Link to="/" className="flex items-center text-sm font-medium text-[#111827] hover:text-gray-600 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
