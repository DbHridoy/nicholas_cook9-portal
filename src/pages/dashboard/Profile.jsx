import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Phone, Lock, Camera, Check, AlertCircle, Save } from 'lucide-react';
import { setUser } from '../../store/authSlice';
import { api } from '../../lib/api';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Redux state
  const { name, user: email, role, avatar, address, mobile } = useSelector((state) => state.auth);
  const roleLabel = role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Dealer';

  // Component state
  const [formName, setFormName] = useState(name || '');
  const [formAddress, setFormAddress] = useState(address || '');
  const [formMobile, setFormMobile] = useState(mobile || '');
  const [formAvatar, setFormAvatar] = useState(avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  useEffect(() => {
    let active = true;

    api.getMyProfile()
      .then((userData) => {
        if (!active) return;
        dispatch(setUser(userData));
        setFormName(userData.name || '');
        setFormAddress(userData.address || '');
        setFormMobile(userData.mobile || '');
        setFormAvatar(userData.avatar || '');
      })
      .catch(() => {
        // Dashboard layout already handles stale session state; keep the editable form usable here.
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: 'Image size should be less than 2MB', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormAvatar(reader.result);
      setMessage({ text: 'Custom avatar uploaded successfully!', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!formName.trim()) {
      setMessage({ text: 'Name is required', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await api.updateMyProfile({
        name: formName.trim(),
        avatar: formAvatar.trim(),
        address: formAddress.trim(),
        mobile: formMobile.trim(),
      });

      dispatch(setUser(updatedUser));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initials = (name || email || 'PU')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'PU';

  return (
    <div className="portal-page animate-fade-in mx-auto w-full max-w-7xl">
      <div className="portal-page-header">
        <div>
          <h1 className="portal-page-title">My Profile</h1>
          <p className="portal-page-subtitle">Manage your personal information, address details, avatar representation, and account credentials.</p>
        </div>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2.5 rounded-lg border px-[18px] py-3 text-sm transition ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-6">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
          
          {/* Left Column: Visual Profile Card */}
          <div className="portal-card flex h-fit min-w-0 flex-col items-center p-7 max-sm:p-5.5">
            <div className="relative mb-5">
              <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-text-primary text-3xl font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                {formAvatar ? (
                  <img src={formAvatar} alt={name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0.5 right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(135deg,#e8a020,#f5bc50)] text-white shadow-[0_4px_10px_rgba(232,160,32,0.3)] transition-transform hover:scale-110"
                title="Upload custom picture"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h2 className="mb-1 text-center text-lg font-bold text-text-primary">{formName || 'Your Name'}</h2>
            <span className="mb-4 rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.05em] text-accent-gold">{roleLabel}</span>

            <div className="flex w-full flex-col gap-3 border-t border-slate-100 py-4">
              <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-gray-500">
                <Mail size={15} className="shrink-0 text-text-muted" />
                <span className="truncate">{email}</span>
              </div>
              {formMobile && (
                <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-gray-500">
                  <Phone size={15} className="shrink-0 text-text-muted" />
                  <span className="truncate">{formMobile}</span>
                </div>
              )}
            </div>

            {/* Change Password Trigger Button */}
            <div className="mt-2 w-full">
              <button
                type="button"
                onClick={() => navigate('/dashboard/profile/change-password')}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-[11px] text-[13px] font-semibold text-text-secondary transition hover:border-slate-300 hover:bg-slate-100 hover:text-portal-surface"
              >
                <Lock size={15} />
                Change Account Password
              </button>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="portal-card min-w-0 p-8 max-sm:p-5.5">
            <h3 className="mb-5 text-base font-bold text-text-primary">Update Profile Details</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name-input" className="text-[13px] font-semibold text-text-secondary">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-text-muted" />
                    <input
                      id="name-input"
                      type="text"
                      className="portal-input w-full py-2.5 pl-9.5 pr-3 text-sm"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                {/* Email (Read Only - Locked) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email-input" className="flex items-center gap-1 text-[13px] font-semibold text-text-secondary">
                    Email Address 
                    <span className="rounded bg-slate-100 px-1.5 py-px text-[10px] font-medium text-gray-500">Locked</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-text-muted" />
                    <input
                      id="email-input"
                      type="email"
                      className="portal-input w-full cursor-not-allowed border-slate-200 bg-slate-100 py-2.5 pl-9.5 pr-3 text-sm text-gray-500"
                      value={email || ''}
                      readOnly
                      title="Email address cannot be changed."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Mobile */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="mobile-input" className="text-[13px] font-semibold text-text-secondary">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-text-muted" />
                    <input
                      id="mobile-input"
                      type="text"
                      className="portal-input w-full py-2.5 pl-9.5 pr-3 text-sm"
                      value={formMobile}
                      onChange={(e) => setFormMobile(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="address-input" className="text-[13px] font-semibold text-text-secondary">Physical Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-text-muted" />
                  <textarea
                    id="address-input"
                    className="portal-input min-h-20 w-full resize-y py-2.5 pl-9.5 pr-3 text-sm leading-snug"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Enter physical shipping or billing address"
                    rows={3}
                    
                  />
                </div>
              </div>

              

              {/* Submit Action */}
              <div className="mt-2 flex justify-end border-t border-slate-100 pt-5 max-sm:justify-stretch">
                <button
                  type="submit"
                  className="portal-btn-primary flex items-center gap-2 px-6 py-2.5 text-sm max-sm:w-full max-sm:justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
