import React, { useEffect, useState } from 'react';
import styles from './TimerPreview.module.css';

interface TimerPreviewProps {
  startTime: string;
  endTime: string;
  title: string;
  imageUrl?: string;
}

export const TimerPreview: React.FC<TimerPreviewProps> = ({
  startTime,
  endTime,
  title,
  imageUrl,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const total = end - start;
      const remaining = Math.max(0, end - now);

      const progressPercent = ((total - remaining) / total) * 100;
      setProgress(Math.min(100, progressPercent));

      const minutes = Math.floor(remaining / 60000);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes % 60}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }

      setIsUrgent(minutes < 15);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <div className={styles.imageContainer}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>Image / Video</span>
            </div>
          )}

          <div className={styles.timerOverlay}>
            <div className={styles.liveLabel}>
              <span className={styles.dot}>●</span>
              <span>LIVE</span>
            </div>
            <div className={styles.timeText}>{timeLeft}</div>
          </div>
        </div>

        <div
          className={`${styles.progressBar} ${isUrgent ? styles.urgent : ''}`}
          style={{ width: `${progress}%` }}
        />

        <div className={styles.content}>
          <h3>{title}</h3>
          <div className={styles.timeInfo}>
            <span className={styles.label}>Active Window</span>
            <span className={styles.time}>{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.infoText}>
          This is how your special will appear to customers. The progress bar shows
          how much time is remaining.
        </p>
      </div>
    </div>
  );
};
