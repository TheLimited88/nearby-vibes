'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './venue-setup.module.css';

interface SetupStep {
  id: string;
  label: string;
  completed: boolean;
}

export default function VenueSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [venueData, setVenueData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    category: 'bar',
  });

  const steps: SetupStep[] = [
    { id: 'info', label: 'Venue Info', completed: false },
    { id: 'location', label: 'Location', completed: false },
    { id: 'contact', label: 'Contact', completed: false },
    { id: 'category', label: 'Category', completed: false },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete setup
      router.push('/venue-home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h1 className={styles.title}>Set up Your Venue</h1>

        <form className={styles.form}>
          {currentStep === 0 && (
            <div className={styles.formStep}>
              <label className={styles.label}>Venue Name</label>
              <input
                type="text"
                placeholder="e.g., Aye Aye Bar"
                value={venueData.name}
                onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                className={styles.input}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.formStep}>
              <label className={styles.label}>Full Address</label>
              <input
                type="text"
                placeholder="118 5th Ave, San Francisco, CA 94103"
                value={venueData.address}
                onChange={(e) => setVenueData({ ...venueData, address: e.target.value })}
                className={styles.input}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.formStep}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={venueData.phone}
                onChange={(e) => setVenueData({ ...venueData, phone: e.target.value })}
                className={styles.input}
              />
              <label className={styles.label}>Website</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={venueData.website}
                onChange={(e) => setVenueData({ ...venueData, website: e.target.value })}
                className={styles.input}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.formStep}>
              <label className={styles.label}>Venue Category</label>
              <div className={styles.categoryOptions}>
                {['bar', 'restaurant', 'cafe', 'nightclub'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.categoryBtn} ${venueData.category === cat ? styles.selected : ''}`}
                    onClick={() => setVenueData({ ...venueData, category: cat })}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        <div className={styles.actions}>
          {currentStep > 0 && (
            <button className={styles.backBtnAlt} onClick={handleBack}>
              Back
            </button>
          )}
          <button className={styles.nextBtn} onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Finish Setup' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
}
