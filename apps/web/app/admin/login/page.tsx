'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Call admin login API
      console.log('Admin login with', email);
      setStep('totp');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Verify TOTP and complete login
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Invalid TOTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Portal</h1>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta text-white py-3 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <p className="text-text-secondary text-sm">
              Enter the 6-digit code from your authenticator app
            </p>

            <div>
              <label className="block text-sm font-medium mb-2">Authenticator Code</label>
              <input
                type="text"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-center font-mono text-2xl"
                required
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading || totp.length !== 6}
              className="w-full btn-cta text-white py-3 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full border border-border-default py-3 rounded-md font-semibold hover:bg-background transition"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
