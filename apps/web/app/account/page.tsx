'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: 'user@example.com',
    displayName: 'John Doe',
    ageVerified: true,
    distanceUnit: 'mi' as 'mi' | 'km',
  });

  const handleLogout = () => {
    // TODO: Call logout API
    router.push('/');
  };

  const handleDistanceUnitChange = (unit: 'mi' | 'km') => {
    setUser({ ...user, distanceUnit: unit });
    // TODO: Save preference to API
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/home" className="text-accent-primary font-semibold">
            ←
          </Link>
          <h1 className="text-lg font-bold">Account</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-20">
        {/* User Info */}
        <div className="bg-surface p-4 rounded-lg shadow-card">
          <h3 className="font-bold mb-3">Account</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-secondary mb-1">Name</p>
              <p className="font-semibold">{user.displayName}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-surface p-4 rounded-lg shadow-card">
          <h3 className="font-bold mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Distance Unit</label>
              <div className="flex gap-3">
                {(['mi', 'km'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleDistanceUnitChange(unit)}
                    className={`flex-1 py-2 rounded-md font-semibold transition ${
                      user.distanceUnit === unit
                        ? 'bg-accent-primary text-white'
                        : 'bg-background text-text-secondary hover:bg-background'
                    }`}
                  >
                    {unit === 'mi' ? 'Miles' : 'Kilometers'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Age Verified</span>
              <span className="text-accent-success font-semibold">✓</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-surface p-4 rounded-lg shadow-card">
          <h3 className="font-bold mb-3">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium">Push notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium">Email notifications</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/account/change-password"
            className="w-full border border-border-default py-3 rounded-md font-semibold text-center hover:bg-background transition"
          >
            Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-600 py-3 rounded-md font-semibold hover:bg-red-500/20 transition"
          >
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}
