'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Nearby Vibes',
      description: 'Discover time-limited drink and food specials from venues near you',
      icon: '🎉',
    },
    {
      title: 'Get Alerts for New Specials',
      description: 'Turn on notifications to get instant updates when a venue you follow goes live with a deal',
      icon: '🔔',
    },
    {
      title: 'Follow Your Favorite Venues',
      description: 'Start following venues to see all their specials and get notified when they post',
      icon: '⭐',
    },
    {
      title: 'Explore & Save',
      description: 'Browse nearby specials, save your favorites, and never miss a great deal',
      icon: '🗺️',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/home');
    }
  };

  const handleSkip = () => {
    router.push('/home');
  };

  const currentStep = steps[step];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>{currentStep.icon}</div>
        <h1 className={styles.title}>{currentStep.title}</h1>
        <p className={styles.description}>{currentStep.description}</p>

        <div className={styles.dots}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`${styles.dot} ${idx === step ? styles.active : ''}`}
            ></div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.nextBtn} onClick={handleNext}>
          {step === steps.length - 1 ? 'Get Started' : 'Next'}
        </button>
        <button className={styles.skipBtn} onClick={handleSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}
