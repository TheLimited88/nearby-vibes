'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiStepForm } from '@/components/MultiStepForm';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { TimerPreview } from '@/components/TimerPreview';
import { useAuthStore } from '@/stores/authStore';
import { postsAPI } from '@/lib/apiClient';
import styles from './create.module.css';

interface PostData {
  title: string;
  description: string;
  imageUrl: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  discountTerms: string;
  startTime: string;
  endTime: string;
}

const STEPS = [
  { id: 'basic', label: 'Basic Info', description: 'Title and description' },
  { id: 'image', label: 'Image', description: 'Add hero image or video' },
  { id: 'discount', label: 'Discount', description: 'Discount details' },
  { id: 'timing', label: 'Active Window', description: 'When is this live?' },
  { id: 'preview', label: 'Preview', description: 'Review your post' },
  { id: 'review', label: 'Review', description: 'Final check' },
];

export default function CreatePost() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [postData, setPostData] = useState<PostData>({
    title: '',
    description: '',
    imageUrl: '',
    discountAmount: 0,
    discountType: 'percentage',
    discountTerms: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  });

  React.useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin?role=venue');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: keyof PostData, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!postData.title && !!postData.description;
      case 1:
        return !!postData.imageUrl;
      case 2:
        return postData.discountAmount > 0;
      case 3:
        return !!postData.startTime && !!postData.endTime;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await postsAPI.createPost({
        title: postData.title,
        description: postData.description,
        image_url: postData.imageUrl,
        discount_amount: postData.discountAmount,
        discount_type: postData.discountType,
        discount_terms: postData.discountTerms,
        start_time: postData.startTime,
        end_time: postData.endTime,
        status: 'published',
      });

      router.push('/venue/posts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>NV</div>
          <span className={styles.logoText}>Nearby Vibes</span>
        </div>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
      </header>

      <div className={styles.header}>
        <h1>Create Special</h1>
        <p>Post a time-limited special to attract customers</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <MultiStepForm
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        isValid={isStepValid()}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        {currentStep === 0 && (
          <div className={styles.formSection}>
            <Input
              label="Special Title"
              placeholder="e.g., Happy Hour Specials"
              value={postData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                placeholder="What's the special? Include any details customers should know"
                value={postData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={styles.textarea}
                rows={5}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className={styles.formSection}>
            <Input
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              type="url"
              value={postData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              helperText="Use a high-quality 9:16 image (e.g., 540x960px)"
              required
            />

            {postData.imageUrl && (
              <div className={styles.imagePreview}>
                <img src={postData.imageUrl} alt="Preview" />
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <Input
                label="Discount Amount"
                type="number"
                min="0"
                value={postData.discountAmount}
                onChange={(e) =>
                  handleInputChange('discountAmount', parseFloat(e.target.value))
                }
                required
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>Type</label>
                <select
                  className={styles.select}
                  value={postData.discountType}
                  onChange={(e) =>
                    handleInputChange(
                      'discountType',
                      e.target.value as 'percentage' | 'fixed'
                    )
                  }
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Terms & Conditions</label>
              <textarea
                placeholder="e.g., Valid for dine-in only, one per customer"
                value={postData.discountTerms}
                onChange={(e) => handleInputChange('discountTerms', e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.formSection}>
            <Input
              label="Start Time"
              type="datetime-local"
              value={postData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              required
            />

            <Input
              label="End Time"
              type="datetime-local"
              value={postData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              required
            />

            <div className={styles.timeHint}>
              <p>
                💡 Posts must be at least 30 minutes long and no more than 7 days
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className={styles.previewSection}>
            <TimerPreview
              title={postData.title}
              imageUrl={postData.imageUrl}
              startTime={postData.startTime}
              endTime={postData.endTime}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className={styles.reviewSection}>
            <Card>
              <h3>Review Your Special</h3>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Title</span>
                <span className={styles.reviewValue}>{postData.title}</span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Description</span>
                <span className={styles.reviewValue}>{postData.description}</span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Discount</span>
                <span className={styles.reviewValue}>
                  {postData.discountAmount}
                  {postData.discountType === 'percentage' ? '%' : '$'} off
                </span>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Active Window</span>
                <span className={styles.reviewValue}>
                  {new Date(postData.startTime).toLocaleString()} -{' '}
                  {new Date(postData.endTime).toLocaleString()}
                </span>
              </div>

              <div className={styles.reviewNote}>
                ✓ Everything looks good! Click "Publish Post" to go live.
              </div>
            </Card>
          </div>
        )}
      </MultiStepForm>
    </div>
  );
}
