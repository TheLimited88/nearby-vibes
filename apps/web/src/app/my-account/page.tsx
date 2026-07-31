'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import styles from './my-account.module.css';

export default function MyAccount() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState<'mi' | 'km'>('mi');

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion API call
      handleSignOut();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      {/* Profile Section */}
      <section className={styles.profileSection}>
        <div className={styles.avatar}>
          <svg width="20" height="22" viewBox="0 0 16 18" fill="none">
            <circle cx="8" cy="5" r="4" stroke="#0A0A0A" strokeWidth="1.6"/>
            <path d="M1 17c0-4 3-6 7-6s7 2 7 6" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className={styles.userName}>{user?.display_name || 'User'}</h2>
          <p className={styles.userEmail}>{user?.email || ''}</p>
        </div>
      </section>

      {/* Venues You Follow */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>VENUES YOU FOLLOW</h3>
        <div className={styles.venueList}>
          <div className={styles.venueCard}>
            <div className={styles.venuePhoto}></div>
            <div className={styles.venueInfo}>
              <div className={styles.venueName}>Aye Aye Bar</div>
              <div className={styles.venueAddress}>118 5th Ave</div>
            </div>
            <button className={styles.notificationButton} title="Toggle notifications">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M6 4.5C6.8 3 8.3 2 10 2C12.5 2 14.5 4 14.5 6.5V9.5C14.5 10.6 14.8 11.6 15.4 12.4" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.5 8.5V9.5C4.5 11 4 12.4 3 13.5H16" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 16a2 2 0 004 0" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2L16 16" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className={styles.venueCard}>
            <div className={styles.venuePhoto}></div>
            <div className={styles.venueInfo}>
              <div className={styles.venueName}>241 Bar</div>
              <div className={styles.venueAddress}>241 Main St</div>
            </div>
            <button className={styles.notificationButton} title="Toggle notifications">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M6 4.5C6.8 3 8.3 2 10 2C12.5 2 14.5 4 14.5 6.5V9.5C14.5 10.6 14.8 11.6 15.4 12.4" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.5 8.5V9.5C4.5 11 4 12.4 3 13.5H16" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 16a2 2 0 004 0" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 2L16 16" stroke="#7F53F3" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>SETTINGS</h3>

        {/* Push Notifications Toggle */}
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Push Notifications</div>
            <div className={styles.settingHint}>Alerts when a followed venue goes live</div>
          </div>
          <button
            className={`${styles.toggle} ${pushNotificationsEnabled ? styles.enabled : ''}`}
            onClick={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
            aria-label="Toggle push notifications"
          >
            <div className={styles.toggleThumb}></div>
          </button>
        </div>

        {/* Distance Units */}
        <div className={styles.settingGroup}>
          <div className={styles.settingLabel}>Units of Distance</div>
          <div className={styles.distanceButtons}>
            <button
              className={`${styles.distanceBtn} ${distanceUnit === 'mi' ? styles.active : ''}`}
              onClick={() => setDistanceUnit('mi')}
            >
              Miles
            </button>
            <button
              className={`${styles.distanceBtn} ${distanceUnit === 'km' ? styles.active : ''}`}
              onClick={() => setDistanceUnit('km')}
            >
              Kilometers
            </button>
          </div>
        </div>

        {/* Legal Links */}
        <a href="/terms" className={styles.link}>Terms of Service</a>
        <a href="/privacy" className={styles.link}>Privacy Policy</a>
      </section>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2L21 20H1L11 2Z" stroke="#C0392B" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M11 9V13" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="11" cy="16" r="1" fill="#C0392B"/>
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Delete your account?</h3>
            <p className={styles.modalText}>
              This permanently removes your profile, followed venues, and preferences. This can't be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalDeleteBtn}
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </button>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
