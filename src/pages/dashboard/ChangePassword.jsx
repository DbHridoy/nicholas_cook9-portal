import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldAlert, CheckCircle, ArrowLeft, Key, Lock } from 'lucide-react';
import { api } from '../../lib/api';

export default function ChangePassword() {
  const navigate = useNavigate();

  // Inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Client validations
    if (!currentPassword) {
      setMessage({ text: 'Current password is required', type: 'error' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters long', type: 'error' });
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setMessage({ text: 'New password cannot be the same as current password', type: 'error' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await api.changeMyPassword({
        currentPassword,
        newPassword,
      });

      setMessage({ text: 'Password changed successfully! Redirecting back to profile...', type: 'success' });
      
      // Delay redirection so the user sees the success toast
      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Failed to change password. Make sure current password is correct.', type: 'error' });
      setLoading(false);
    }
  };

  const isPasswordMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 6;

  return (
    <div className="portal-page animate-fade-in">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/profile')}
          className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent py-1 text-[13px] font-semibold text-text-secondary transition hover:text-accent-gold"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </button>
      </div>

      <div className="portal-page-header mt-1.5">
        <div>
          <h1 className="portal-page-title">Change Password</h1>
          <p className="portal-page-subtitle">Security settings. Protect your portal workspace by establishing a fresh, strong password credential.</p>
        </div>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2.5 rounded-lg border px-[18px] py-3 text-sm transition ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        
        {/* Left Side: Change Password Form */}
        <div className="portal-card p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="current-pwd-input" className="text-[13px] font-semibold text-text-secondary">Current Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-text-muted" />
                <input
                  id="current-pwd-input"
                  type={showCurrent ? 'text' : 'password'}
                  className="portal-input w-full py-2.5 pl-9.5 pr-10.5 text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.75 cursor-pointer border-0 bg-transparent p-0 text-text-muted hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-pwd-input" className="text-[13px] font-semibold text-text-secondary">New Password</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-3 text-text-muted" />
                <input
                  id="new-pwd-input"
                  type={showNew ? 'text' : 'password'}
                  className="portal-input w-full py-2.5 pl-9.5 pr-10.5 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.75 cursor-pointer border-0 bg-transparent p-0 text-text-muted hover:text-gray-600"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-pwd-input" className="text-[13px] font-semibold text-text-secondary">Confirm New Password</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-3 text-text-muted" />
                <input
                  id="confirm-pwd-input"
                  type={showConfirm ? 'text' : 'password'}
                  className="portal-input w-full py-2.5 pl-9.5 pr-10.5 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.75 cursor-pointer border-0 bg-transparent p-0 text-text-muted hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-2 flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                className="portal-btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : null}
                {loading ? 'Changing Password...' : 'Update Password'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Security Checklist & Status */}
        <div className="portal-card h-fit bg-slate-50 p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.04em] text-text-primary">Security Requirements</h3>
          
          <div className="flex flex-col gap-3.5">
            <div className="flex items-start gap-2.5">
              <div className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isPasswordValid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-text-muted'}`}>
                ✓
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-secondary">Minimum length</div>
                <div className="text-[11px] text-text-muted">Your password must be at least 6 characters long.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isPasswordMatch ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-text-muted'}`}>
                ✓
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-secondary">Passwords match</div>
                <div className="text-[11px] text-text-muted">Both entries of your new password must match perfectly.</div>
              </div>
            </div>

            <div className="mt-2.5 rounded-lg border border-accent-gold/15 bg-accent-gold/10 px-3.5 py-3 text-xs leading-snug text-yellow-700">
              <strong>Tip:</strong> Create a strong passphrase by combining words, numbers, and symbols that are easy for you to remember but hard for others to guess.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
