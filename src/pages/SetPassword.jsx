import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RotateCcw, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { api } from '../lib/api';

export default function SetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const email = sessionStorage.getItem('passwordResetEmail') ?? '';
      const resetToken = sessionStorage.getItem('passwordResetToken') ?? '';
      await api.resetPassword(email, resetToken, password);
      sessionStorage.removeItem('passwordResetEmail');
      sessionStorage.removeItem('passwordResetToken');
      navigate('/reset-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="w-full max-w-md">
        <Logo subtitle="Secure Your Account" />
        
        <div className="auth-card">
          <h2 className="text-xl font-bold text-[#111827] mb-2">Set New Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Create a strong password to secure your account.
          </p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent text-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent text-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="portal-btn-primary w-full flex justify-center items-center py-3 px-4 text-sm mt-2"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
              <RotateCcw className="ml-2 h-4 w-4" />
            </button>
            
            <div className="pt-4 border-t border-gray-100 flex justify-center mt-6">
              <Link to="/" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
