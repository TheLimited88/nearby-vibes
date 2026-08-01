'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-onboarding-queue.module.css';

interface VenueSubmission {
  id: string;
  venueName: string;
  ownerName: string;
  ownerEmail: string;
  address: string;
  city: string;
  phone: string;
  category: string;
  website?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export default function AdminOnboardingQueuePage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<VenueSubmission[]>([
    {
      id: '1',
      venueName: 'The Local Bar & Grill',
      ownerName: 'John Doe',
      ownerEmail: 'john@localbar.com',
      address: '123 Main St',
      city: 'Downtown',
      phone: '555-1234',
      category: 'Bar & Restaurant',
      website: 'localbar.com',
      submittedAt: '2024-07-28',
      status: 'pending',
    },
    {
      id: '2',
      venueName: 'The Sports Hub',
      ownerName: 'Jane Smith',
      ownerEmail: 'jane@sportshub.com',
      address: '456 Elm Ave',
      city: 'Uptown',
      phone: '555-5678',
      category: 'Sports Bar',
      submittedAt: '2024-07-27',
      status: 'pending',
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<VenueSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = () => {
    if (!selectedSubmission) return;
    setSubmissions(
      submissions.map((s) =>
        s.id === selectedSubmission.id
          ? { ...s, status: 'approved', notes: reviewNotes }
          : s
      )
    );
    setSelectedSubmission(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!selectedSubmission) return;
    setSubmissions(
      submissions.map((s) =>
        s.id === selectedSubmission.id
          ? { ...s, status: 'rejected', notes: reviewNotes }
          : s
      )
    );
    setSelectedSubmission(null);
    setReviewNotes('');
  };

  const filteredSubmissions = submissions.filter(
    (s) => filter === 'all' || s.status === filter
  );

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Onboarding Queue</h1>
        {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
      </header>

      <main className={styles.content}>
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f === 'approved' ? 'Approved' : 'Rejected'}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className={styles.submissionsList}>
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`${styles.submissionCard} ${submission.status === 'pending' ? styles.pending : ''}`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className={styles.submissionHeader}>
                  <div>
                    <h3 className={styles.venueName}>{submission.venueName}</h3>
                    <p className={styles.ownerName}>Owner: {submission.ownerName}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[submission.status]}`}>
                    {submission.status === 'pending' ? '⏳ Pending' : submission.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </span>
                </div>
                <div className={styles.submissionDetails}>
                  <p>{submission.address}, {submission.city}</p>
                  <p>{submission.phone}</p>
                  <p className={styles.category}>{submission.category}</p>
                </div>
                <p className={styles.submittedDate}>
                  Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No {filter !== 'all' ? filter : ''} submissions</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedSubmission && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Review Submission</h2>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setSelectedSubmission(null);
                setReviewNotes('');
              }}
            >
              ✕
            </button>
          </div>

          <div className={styles.panelContent}>
            {/* Venue Info */}
            <section className={styles.section}>
              <h3>Venue Information</h3>
              <div className={styles.info}>
                <div className={styles.field}>
                  <label>Venue Name</label>
                  <p>{selectedSubmission.venueName}</p>
                </div>
                <div className={styles.field}>
                  <label>Address</label>
                  <p>{selectedSubmission.address}, {selectedSubmission.city}</p>
                </div>
                <div className={styles.field}>
                  <label>Category</label>
                  <p>{selectedSubmission.category}</p>
                </div>
                <div className={styles.field}>
                  <label>Website</label>
                  <p>{selectedSubmission.website || 'Not provided'}</p>
                </div>
              </div>
            </section>

            {/* Owner Info */}
            <section className={styles.section}>
              <h3>Owner Information</h3>
              <div className={styles.info}>
                <div className={styles.field}>
                  <label>Owner Name</label>
                  <p>{selectedSubmission.ownerName}</p>
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <p>{selectedSubmission.ownerEmail}</p>
                </div>
                <div className={styles.field}>
                  <label>Phone</label>
                  <p>{selectedSubmission.phone}</p>
                </div>
              </div>
            </section>

            {/* Review Notes */}
            {selectedSubmission.status === 'pending' && (
              <section className={styles.section}>
                <label htmlFor="notes" className={styles.label}>
                  Review Notes
                </label>
                <textarea
                  id="notes"
                  className={styles.textarea}
                  placeholder="Add notes for this submission..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </section>
            )}

            {selectedSubmission.notes && (
              <section className={styles.section}>
                <label className={styles.label}>Admin Notes</label>
                <p className={styles.noteText}>{selectedSubmission.notes}</p>
              </section>
            )}
          </div>

          {/* Actions */}
          <div className={styles.panelActions}>
            {selectedSubmission.status === 'pending' ? (
              <>
                <button className={styles.approveBtn} onClick={handleApprove}>
                  ✓ Approve
                </button>
                <button className={styles.rejectBtn} onClick={handleReject}>
                  ✗ Reject
                </button>
              </>
            ) : (
              <button className={styles.closeActionBtn} onClick={() => setSelectedSubmission(null)}>
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Panel Overlay */}
      {selectedSubmission && (
        <div
          className={styles.overlay}
          onClick={() => {
            setSelectedSubmission(null);
            setReviewNotes('');
          }}
        />
      )}
    </div>
  );
}
