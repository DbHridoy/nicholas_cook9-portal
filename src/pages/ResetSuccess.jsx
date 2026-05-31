import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function ResetSuccess() {
  return (
    <div className="auth-shell">
      <div className="w-full max-w-md">
        <Logo subtitle="Password Updated" />
        
        <div className="auth-card text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#4F6288]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#111827] mb-3">Password Reset Successful</h2>
          <p className="text-sm text-gray-500 mb-8 px-4">
            Your password has been updated. You can now sign in with your new credentials.
          </p>
          
          <Link
            to="/"
            className="portal-btn-primary w-full flex justify-center items-center py-3 px-4 text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
