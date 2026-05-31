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
    <div className="animate-fade-in" style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/dashboard/dealers')}
            className="portal-btn-ghost"
            style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Back to dealers"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              {canCreateByRole ? 'Create User' : 'Create Dealer'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0' }}>
              {canCreateByRole
                ? 'Add an admin or dealer account and send their temporary login credentials.'
                : 'Add a new dealer account and send their temporary login credentials.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/dealers')}
          className="portal-btn-ghost"
          style={{ padding: '9px 14px', fontSize: 13 }}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)', color: '#dc2626', borderRadius: 9, fontSize: 13, fontWeight: 600 }}>
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="portal-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div className="stat-icon-blue" style={{ padding: 9 }}>
                <Store size={17} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selectedRoleLabel} Account</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>The backend creates credentials automatically for the selected role.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
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
                  className="portal-input"
                  style={{ width: '100%', padding: '10px 12px', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  <Mail size={12} />
                  Primary Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                  placeholder={selectedRole === 'admin' ? 'admin@example.com' : 'dealer@example.com'}
                  className="portal-input"
                  style={{ width: '100%', padding: '10px 12px', fontSize: 14 }}
                />
              </div>

              {canCreateByRole && (
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    <ShieldCheck size={12} />
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))}
                    className="portal-input"
                    style={{ width: '100%', padding: '10px 12px', fontSize: 14 }}
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

          <div className="portal-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="stat-icon-gold" style={{ padding: 9 }}>
                <ShieldCheck size={17} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Credential Delivery</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>The backend generates a temporary password automatically.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {[
                'A temporary password is generated server-side.',
                `The welcome email is sent to the ${selectedRoleLabel.toLowerCase()} address.`,
                'Creation rolls back if email delivery fails.',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: 12, background: '#f9fafb', border: '1px solid #e9ecef', borderRadius: 9 }}>
                  <CheckCircle2 size={15} style={{ color: '#059669', marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard/dealers')}
              className="portal-btn-ghost"
              style={{ padding: '10px 16px', fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="portal-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: 13, opacity: isSubmitting || !isValid ? 0.65 : 1, cursor: isSubmitting || !isValid ? 'not-allowed' : 'pointer' }}
            >
              <Save size={15} />
              {isSubmitting ? `Creating ${selectedRoleLabel}...` : `Create ${selectedRoleLabel}`}
            </button>
          </div>
        </div>

        <aside className="portal-card" style={{ padding: 20, position: 'sticky', top: 82 }}>
          <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #152231, #334155)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {form.name || `New ${selectedRoleLabel}`}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {form.email || (selectedRole === 'admin' ? 'admin@example.com' : 'dealer@example.com')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Role</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{selectedRoleLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Initial status</span>
              <span className="badge-resolved">active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Password</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Auto-generated</span>
            </div>
          </div>

          <div style={{ marginTop: 18, padding: 13, background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.16)', borderRadius: 9, display: 'flex', gap: 9 }}>
            <Sparkles size={15} style={{ color: '#2563eb', flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, color: '#2563eb', lineHeight: 1.5, fontWeight: 600 }}>
              {canCreateByRole
                ? 'Super admins can create admin and dealer users. Super admin creation remains restricted to the seed flow.'
                : 'Admins can create dealer users only. Admin account creation is restricted to super admins.'}
            </p>
          </div>
        </aside>
      </form>

      <style>{`
        @media (max-width: 900px) {
          form {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
