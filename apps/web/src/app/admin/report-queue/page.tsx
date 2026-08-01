'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-report-queue.module.css';

interface Report {
  id: string;
  postId: string;
  postTitle: string;
  venueName: string;
  reportedBy: string;
  reason: string;
  details: string;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  action?: string;
  actionAt?: string;
}

export default function AdminReportQueuePage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      postId: 'post_1',
      postTitle: '2 for 1 Margaritas',
      venueName: 'The Local Bar',
      reportedBy: 'user_123',
      reason: 'False information',
      details: 'This deal ended 3 days ago but is still posted',
      reportedAt: '2024-07-28',
      status: 'pending',
    },
    {
      id: '2',
      postId: 'post_2',
      postTitle: 'Offensive Happy Hour',
      venueName: 'Sports Hub',
      reportedBy: 'user_456',
      reason: 'Offensive language',
      details: 'Post title contains inappropriate language',
      reportedAt: '2024-07-27',
      status: 'pending',
    },
    {
      id: '3',
      postId: 'post_3',
      postTitle: 'Spam Deal Post',
      venueName: 'Spam Venue',
      reportedBy: 'user_789',
      reason: 'Spam',
      details: 'Repeated posting of low-quality content',
      reportedAt: '2024-07-26',
      status: 'resolved',
      action: 'Post removed',
      actionAt: '2024-07-27',
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [action, setAction] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');

  const handleResolve = () => {
    if (!selectedReport || !action) return;
    setReports(
      reports.map((r) =>
        r.id === selectedReport.id
          ? { ...r, status: 'resolved', action, actionAt: new Date().toISOString().split('T')[0] }
          : r
      )
    );
    setSelectedReport(null);
    setAction('');
  };

  const handleDismiss = () => {
    if (!selectedReport) return;
    setReports(
      reports.map((r) =>
        r.id === selectedReport.id
          ? { ...r, status: 'dismissed', action: 'Dismissed', actionAt: new Date().toISOString().split('T')[0] }
          : r
      )
    );
    setSelectedReport(null);
    setAction('');
  };

  const filteredReports = reports.filter(
    (r) => filter === 'all' || r.status === filter
  );

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Report Queue</h1>
        {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
      </header>

      <main className={styles.content}>
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {(['all', 'pending', 'resolved', 'dismissed'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f === 'resolved' ? 'Resolved' : 'Dismissed'}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className={styles.reportsList}>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className={`${styles.reportCard} ${report.status === 'pending' ? styles.pending : ''}`}
                onClick={() => setSelectedReport(report)}
              >
                <div className={styles.reportHeader}>
                  <div>
                    <h3 className={styles.postTitle}>{report.postTitle}</h3>
                    <p className={styles.venueName}>from {report.venueName}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[report.status]}`}>
                    {report.status === 'pending' ? '⏳ Pending' : report.status === 'resolved' ? '✓ Resolved' : '◯ Dismissed'}
                  </span>
                </div>
                <div className={styles.reportDetails}>
                  <span className={styles.reason}>{report.reason}</span>
                  <p className={styles.details}>{report.details}</p>
                </div>
                <p className={styles.reportedDate}>
                  Reported: {new Date(report.reportedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No {filter !== 'all' ? filter : ''} reports</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedReport && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Review Report</h2>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setSelectedReport(null);
                setAction('');
              }}
            >
              ✕
            </button>
          </div>

          <div className={styles.panelContent}>
            {/* Report Info */}
            <section className={styles.section}>
              <h3>Report Details</h3>
              <div className={styles.info}>
                <div className={styles.field}>
                  <label>Post Title</label>
                  <p>{selectedReport.postTitle}</p>
                </div>
                <div className={styles.field}>
                  <label>Venue</label>
                  <p>{selectedReport.venueName}</p>
                </div>
                <div className={styles.field}>
                  <label>Reason</label>
                  <p className={styles.reason}>{selectedReport.reason}</p>
                </div>
                <div className={styles.field}>
                  <label>Details</label>
                  <p>{selectedReport.details}</p>
                </div>
              </div>
            </section>

            {/* Report Meta */}
            <section className={styles.section}>
              <h3>Metadata</h3>
              <div className={styles.info}>
                <div className={styles.field}>
                  <label>Reported By</label>
                  <p>{selectedReport.reportedBy}</p>
                </div>
                <div className={styles.field}>
                  <label>Reported At</label>
                  <p>{new Date(selectedReport.reportedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            {/* Previous Action */}
            {selectedReport.status !== 'pending' && selectedReport.action && (
              <section className={styles.section}>
                <h3>Resolution</h3>
                <div className={styles.info}>
                  <div className={styles.field}>
                    <label>Action Taken</label>
                    <p>{selectedReport.action}</p>
                  </div>
                  {selectedReport.actionAt && (
                    <div className={styles.field}>
                      <label>Resolved At</label>
                      <p>{new Date(selectedReport.actionAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Action Options (for pending) */}
            {selectedReport.status === 'pending' && (
              <section className={styles.section}>
                <label htmlFor="action" className={styles.label}>
                  Action to Take
                </label>
                <select
                  id="action"
                  className={styles.select}
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <option value="">Select an action...</option>
                  <option value="Post removed">Remove Post</option>
                  <option value="Venue warned">Warn Venue</option>
                  <option value="Venue suspended">Suspend Venue</option>
                  <option value="Account suspended">Suspend Account</option>
                </select>
              </section>
            )}
          </div>

          {/* Actions */}
          <div className={styles.panelActions}>
            {selectedReport.status === 'pending' ? (
              <>
                <button
                  className={styles.resolveBtn}
                  disabled={!action}
                  onClick={handleResolve}
                >
                  ✓ Resolve
                </button>
                <button className={styles.dismissBtn} onClick={handleDismiss}>
                  ◯ Dismiss
                </button>
              </>
            ) : (
              <button className={styles.closeActionBtn} onClick={() => setSelectedReport(null)}>
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Panel Overlay */}
      {selectedReport && (
        <div
          className={styles.overlay}
          onClick={() => {
            setSelectedReport(null);
            setAction('');
          }}
        />
      )}
    </div>
  );
}
