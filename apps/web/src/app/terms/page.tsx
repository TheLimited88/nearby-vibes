'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './legal.module.css';

export default function TermsPage() {
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
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: January 2026</p>

        <section className={styles.section}>
          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using the Nearby Vibes application and website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Nearby Vibes for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Disclaimer</h2>
          <p>
            The materials on Nearby Vibes are provided on an 'as is' basis. Nearby Vibes makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Limitations</h2>
          <p>
            In no event shall Nearby Vibes or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Nearby Vibes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on Nearby Vibes could include technical, typographical, or photographic errors. Nearby Vibes does not warrant that any of the materials on the Service are accurate, complete, or current.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Modifications</h2>
          <p>
            Nearby Vibes may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <p>Email: legal@nearbyvibes.com</p>
        </section>
      </main>
    </div>
  );
}
