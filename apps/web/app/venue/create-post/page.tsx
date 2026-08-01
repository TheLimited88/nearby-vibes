'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isPremium: false,
  });

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // TODO: Submit post to API
    router.push('/venue/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/venue/dashboard" className="text-accent-primary font-semibold">
            ←
          </Link>
          <h1 className="text-lg font-bold">Create Post</h1>
          <span className="text-xs font-semibold text-text-secondary">{step}/6</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-background">
        <div
          className="h-full bg-accent-primary transition-all"
          style={{ width: `${(step / 6) * 100}%` }}
        ></div>
      </div>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-20">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What's the title?</h2>
            <input
              type="text"
              placeholder="e.g. Happy Hour Special"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Describe the special</h2>
            <textarea
              placeholder="Tell customers what they're getting..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary h-32"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">When does it start?</h2>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">When does it end?</h2>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upload hero image</h2>
            <div className="border-2 border-dashed border-border-light rounded-lg p-8 text-center">
              <p className="text-text-secondary">Tap to upload image</p>
              <p className="text-xs text-text-tertiary mt-2">9:16 aspect ratio recommended</p>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Premium special?</h2>
            <div className="bg-surface p-4 rounded-lg border border-border-default cursor-pointer hover:border-accent-primary transition">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="font-semibold">Make this a Premium special</span>
              </label>
              <p className="text-xs text-text-secondary mt-2">
                Premium specials are only visible to paid subscribers
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        {step === 6 && (
          <div className="bg-surface p-4 rounded-lg space-y-3">
            <h3 className="font-bold text-sm">Preview</h3>
            <div className="aspect-square bg-background rounded-lg flex items-center justify-center text-text-tertiary">
              Hero Image
            </div>
            <h4 className="font-semibold">{formData.title || 'Title'}</h4>
            <p className="text-sm text-text-secondary">{formData.description || 'Description'}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="flex-1 border border-border-default py-3 rounded-md font-semibold disabled:opacity-50"
          >
            Back
          </button>
          {step < 6 ? (
            <button
              onClick={handleNext}
              className="flex-1 btn-cta text-white py-3"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 btn-cta text-white py-3"
            >
              Publish
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
