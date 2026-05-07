import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function ResetSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md">
        <Logo subtitle="ENTERPRISE MANAGEMENT" showIcon={false} />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#4F6288]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#111827] mb-3">Password Reset Successful</h2>
          <p className="text-sm text-gray-500 mb-8 px-4">
            Your password has been updated. You can now sign in with your new credentials.
          </p>
          
          <Link
            to="/"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#111827] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
