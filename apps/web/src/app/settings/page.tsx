'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    dealAlerts: true,
    newVenues: false,
  });

  const [preferences, setPreferences] = useState({
    distanceUnit: 'mi' as 'mi' | 'km',
    maxDistance: 5,
    ageRestriction: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePreferences = () => {
    // TODO: Save preferences to backend
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLogout = () => {
    // TODO: Logout
    router.push('/');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure? This cannot be undone.')) {
      // TODO: Delete account
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Settings</h1>
      </header>

      <main className={styles.content}>
        {/* Notifications */}
        <section className={styles.section}>
          <h2>Notifications</h2>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Push Notifications</h3>
              <p>Get alerts for deals at venues you follow</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.pushEnabled}
                onChange={(e) =>
                  setNotifications({ ...notifications, pushEnabled: e.target.checked })
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Email Notifications</h3>
              <p>Receive deal summaries via email</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.emailEnabled}
                onChange={(e) =>
                  setNotifications({ ...notifications, emailEnabled: e.target.checked })
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Deal Alerts</h3>
              <p>Notify me immediately when deals are posted</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.dealAlerts}
                onChange={(e) =>
                  setNotifications({ ...notifications, dealAlerts: e.target.checked })
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>New Venues</h3>
              <p>Notify me when new venues join nearby</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.newVenues}
                onChange={(e) =>
                  setNotifications({ ...notifications, newVenues: e.target.checked })
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </section>

        {/* Preferences */}
        <section className={styles.section}>
          <h2>Preferences</h2>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Distance Unit</h3>
              <p>How to display distances</p>
            </div>
            <div className={styles.unitButtons}>
              <button
                className={`${styles.unitBtn} ${preferences.distanceUnit === 'mi' ? styles.active : ''}`}
                onClick={() => setPreferences({ ...preferences, distanceUnit: 'mi' })}
              >
                Miles
              </button>
              <button
                className={`${styles.unitBtn} ${preferences.distanceUnit === 'km' ? styles.active : ''}`}
                onClick={() => setPreferences({ ...preferences, distanceUnit: 'km' })}
              >
                Kilometers
              </button>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Search Radius</h3>
              <p>Maximum distance to search for venues</p>
            </div>
            <div className={styles.slider}>
              <input
                type="range"
                min="1"
                max="25"
                value={preferences.maxDistance}
                onChange={(e) =>
                  setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })
                }
              />
              <span className={styles.sliderValue}>
                {preferences.maxDistance} {preferences.distanceUnit}
              </span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Age Restriction Filter</h3>
              <p>Only show 21+ venues</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={preferences.ageRestriction}
                onChange={(e) =>
                  setPreferences({ ...preferences, ageRestriction: e.target.checked })
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <button className={styles.saveBtn} onClick={handleSavePreferences}>
            {saveSuccess ? '✓ Saved' : 'Save Preferences'}
          </button>
        </section>

        {/* Account */}
        <section className={styles.section}>
          <h2>Account</h2>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Privacy Policy</h3>
              <p>View our privacy practices</p>
            </div>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Read →
            </a>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Terms of Service</h3>
              <p>View our terms and conditions</p>
            </div>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Read →
            </a>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Version</h3>
              <p>App version</p>
            </div>
            <p className={styles.version}>1.0.0</p>
          </div>
        </section>

        {/* Danger Zone */}
        <section className={styles.section}>
          <h2>Danger Zone</h2>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Log Out</h3>
              <p>Sign out of your account</p>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Log Out
            </button>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabel}>
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all data</p>
            </div>
            <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
              Delete
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
