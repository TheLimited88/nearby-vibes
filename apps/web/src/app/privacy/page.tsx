'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './legal.module.css';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: January 2026</p>

        <section className={styles.section}>
          <h2>Introduction</h2>
          <p>
            Nearby Vibes ("Company", "we", "our", or "us") operates the Nearby Vibes mobile application and website (the "Service").
          </p>
          <p>
            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Information Collection and Use</h2>
          <p>We collect several different types of information for various purposes to provide and improve our Service:</p>
          <ul>
            <li><strong>Personal Data:</strong> Email address, name, phone number, address</li>
            <li><strong>Location Data:</strong> Your device location to show nearby venues and specials</li>
            <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, interactions with content</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Use of Data</h2>
          <p>Nearby Vibes uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service</li>
            <li>To provide customer support</li>
            <li>To send promotional emails and updates</li>
            <li>To monitor the usage of our Service</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@nearbyvibes.com</p>
        </section>
      </main>
    </div>
  );
}
