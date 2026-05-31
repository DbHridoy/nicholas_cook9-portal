import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertCircle, ArrowLeft, CheckCircle2, Mail, Save, ShieldCheck, Sparkles, Store, User } from 'lucide-react';
import { api } from '../../../lib/api';

const roleOptions = [
  { value: 'dealer', label: 'Dealer' },
  { value: 'admin', label: 'Admin' },
];

export default function CreateDealer() {
  const navigate = useNavigate();
  const currentRole = useSelector((state) => state.auth.role);
  const canCreateByRole = currentRole === 'super_admin';
  const [form, setForm] = useState({ name: '', email: '', role: 'dealer' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedRole = canCreateByRole ? form.role : 'dealer';
  const selectedRoleLabel = roleOptions.find((role) => role.value === selectedRole)?.label ?? 'Dealer';

  const initials = useMemo(() => {
    const parts = form.name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase()).join('') || 'ND';
  }, [form.name]);

  const isValid = form.name.trim().length >= 2 && form.email.trim().includes('@');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
      };

      if (canCreateByRole) {
        await api.createUser({
          ...payload,
          role: selectedRole,
        });
      } else {
        await api.createDealer(payload);
      }

      navigate('/dashboard/dealers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1060px] flex-col gap-5.5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/dealers')}
            className="portal-btn-ghost flex h-[38px] w-[38px] items-center justify-center p-0"
            aria-label="Back to dealers"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="m-0 text-2xl font-extrabold text-text-primary">
              {canCreateByRole ? 'Create User' : 'Create Dealer'}
            </h1>
            <p className="m-0 mt-1.25 text-[13px] text-text-muted">
              {canCreateByRole
                ? 'Add an admin or dealer account and send their temporary login credentials.'
                : 'Add a new dealer account and send their temporary login credentials.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/dealers')}
          className="portal-btn-ghost px-3.5 py-2.25 text-[13px]"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.25 rounded-[9px] border border-red-600/20 bg-red-600/10 px-3.5 py-[11px] text-[13px] font-semibold text-red-600">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid items-start gap-[18px] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <div className="portal-card p-5.5">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="stat-icon-blue p-2.25">
                <Store size={17} />
              </div>
              <div>
                <h2 className="m-0 text-base font-extrabold text-text-primary">{selectedRoleLabel} Account</h2>
                <p className="m-0 mt-0.75 text-xs text-text-muted">The backend creates credentials automatically for the selected role.</p>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-text-muted">
                  <User size={12} />
                  Name
                </label>
                <input
                  required
                  type="text"
                  minLength={2}
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  placeholder={selectedRole === 'admin' ? 'e.g. Morgan Taylor' : 'e.g. Skyline Flooring'}
                  className="portal-input w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-text-muted">
                  <Mail size={12} />
                  Primary Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                  placeholder={selectedRole === 'admin' ? 'admin@example.com' : 'dealer@example.com'}
                  className="portal-input w-full px-3 py-2.5 text-sm"
                />
              </div>

              {canCreateByRole && (
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-text-muted">
                    <ShieldCheck size={12} />
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))}
                    className="portal-input w-full px-3 py-2.5 text-sm"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="portal-card p-5.5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="stat-icon-gold p-2.25">
                <ShieldCheck size={17} />
              </div>
              <div>
                <h2 className="m-0 text-base font-extrabold text-text-primary">Credential Delivery</h2>
                <p className="m-0 mt-0.75 text-xs text-text-muted">The backend generates a temporary password automatically.</p>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
              {[
                'A temporary password is generated server-side.',
                `The welcome email is sent to the ${selectedRoleLabel.toLowerCase()} address.`,
                'Creation rolls back if email delivery fails.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.25 rounded-[9px] border border-portal-border-sub bg-gray-50 p-3">
                  <CheckCircle2 size={15} className="mt-px shrink-0 text-emerald-600" />
                  <span className="text-[13px] leading-normal text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/dashboard/dealers')}
              className="portal-btn-ghost px-4 py-2.5 text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="portal-btn-primary flex items-center gap-2 px-[18px] py-2.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-65"
            >
              <Save size={15} />
              {isSubmitting ? `Creating ${selectedRoleLabel}...` : `Create ${selectedRoleLabel}`}
            </button>
          </div>
        </div>

        <aside className="portal-card sticky top-[82px] p-5 max-[900px]:static">
          <p className="m-0 mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-text-muted">Preview</p>
          <div className="mb-[18px] flex items-center gap-3">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[linear-gradient(135deg,#152231,#334155)] text-sm font-black text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold text-text-primary">
                {form.name || `New ${selectedRoleLabel}`}
              </div>
              <div className="truncate text-xs text-text-muted">
                {form.email || (selectedRole === 'admin' ? 'admin@example.com' : 'dealer@example.com')}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-text-muted">Role</span>
              <span className="font-bold text-text-primary">{selectedRoleLabel}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text-muted">Initial status</span>
              <span className="badge-resolved">active</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-text-muted">Password</span>
              <span className="font-bold text-text-primary">Auto-generated</span>
            </div>
          </div>

          <div className="mt-[18px] flex gap-2.25 rounded-[9px] border border-accent-blue/20 bg-accent-blue/10 p-[13px]">
            <Sparkles size={15} className="mt-px shrink-0 text-accent-blue" />
            <p className="m-0 text-xs font-semibold leading-normal text-accent-blue">
              {canCreateByRole
                ? 'Super admins can create admin and dealer users. Super admin creation remains restricted to the seed flow.'
                : 'Admins can create dealer users only. Admin account creation is restricted to super admins.'}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
