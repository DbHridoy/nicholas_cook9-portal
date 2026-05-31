import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { api } from '../lib/api';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const email = sessionStorage.getItem('passwordResetEmail') ?? '';

  const fillOtpFromText = (text, startIndex = 0) => {
    const digits = text.replace(/\D/g, '').slice(0, otp.length - startIndex);
    if (!digits) return;

    const nextOtp = [...otp];
    digits.split('').forEach((digit, offset) => {
      nextOtp[startIndex + offset] = digit;
    });

    setOtp(nextOtp);
    const nextFocusIndex = Math.min(startIndex + digits.length, otp.length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleChange = (element, index) => {
    if (element.value.length > 1) {
      fillOtpFromText(element.value, index);
      return;
    }

    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    fillOtpFromText(e.clipboardData.getData('text'), index);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const code = otp.join('');
      const body = await api.verifyOtp(email, code);
      sessionStorage.setItem('passwordResetToken', body.data.resetToken);
      navigate('/set-password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="w-full max-w-md">
        <Logo subtitle="Verification" />
        
        <div className="auth-card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Verify OTP</h2>
            <p className="text-sm text-gray-500">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-[#111827]">{email || 'your email'}</span>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg">{error}</div>}
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
                    onPaste={e => handlePaste(e, index)}
                    onFocus={e => e.target.select()}
                    ref={el => inputRefs.current[index] = el}
                  />
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="portal-btn-primary w-full flex justify-center items-center py-3 px-4 text-sm"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            
            <div className="pt-6 border-t border-gray-100 text-center space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={() => email && api.forgotPassword(email)}
                  className="text-sm font-medium text-[#111827] hover:underline"
                >
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
