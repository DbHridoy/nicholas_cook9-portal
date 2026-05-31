import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { api } from '../lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await api.forgotPassword(email);
      sessionStorage.setItem('passwordResetEmail', email);
      setMessage('If the account exists, a reset code was sent.');
      navigate('/verify-otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="w-full max-w-md">
        <Logo subtitle="Password Recovery" />
        
        <div className="auth-card">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email address and we'll send you a code to reset your password.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-lg">{error}</div>}
            {message && <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs font-medium rounded-lg">{message}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent text-sm"
                  placeholder="john.doe@enterprise.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="portal-btn-primary w-full flex justify-center items-center py-3 px-4 text-sm"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            
            <div className="pt-4 flex justify-center">
              <Link to="/" className="flex items-center text-sm font-medium text-[#111827] hover:text-gray-600 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
