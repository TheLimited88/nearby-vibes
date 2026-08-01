'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './notifications.module.css';

interface Notification {
  id: string;
  type: 'post_alert' | 'trial_expiry' | 'new_follower';
  title: string;
  message: string;
  venue_name?: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'post_alert',
      title: 'Aye Aye Bar went live!',
      message: '2 for 1 Margaritas - 2.5 hours left',
      venue_name: 'Aye Aye Bar',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'post_alert',
      title: '241 Bar just posted',
      message: 'Half-Price Wings - limited time',
      venue_name: '241 Bar',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: '3',
      type: 'trial_expiry',
      title: 'Trial follow ending',
      message: 'Your trial follow for Aye Aye Bar expires in 24 hours',
      venue_name: 'Aye Aye Bar',
      timestamp: '1 hour ago',
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>Notifications</h1>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount} new</span>
        )}
      </div>

      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className={styles.notificationIcon}>
                {notification.type === 'post_alert' && '⚡'}
                {notification.type === 'trial_expiry' && '⏰'}
                {notification.type === 'new_follower' && '👤'}
              </div>
              <div className={styles.notificationContent}>
                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <p className={styles.timestamp}>{notification.timestamp}</p>
              </div>
              {!notification.read && <div className={styles.unreadDot}></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
