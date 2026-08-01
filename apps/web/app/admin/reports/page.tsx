'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminReportQueuePage() {
  const [reports, setReports] = useState([
    {
      id: '1',
      type: 'content',
      reason: 'Inappropriate content',
      reporter: 'user123',
      postTitle: 'Happy Hour Special',
      venueeName: 'The Local Bar',
      reviewed: false,
      createdAt: new Date('2024-08-01T10:00:00'),
    },
    {
      id: '2',
      type: 'venue',
      reason: 'Misleading information',
      reporter: 'user456',
      venueName: 'Downtown Sports Bar',
      reviewed: false,
      createdAt: new Date('2024-07-31T15:30:00'),
    },
    {
      id: '3',
      type: 'content',
      reason: 'Spam',
      reporter: 'user789',
      postTitle: 'Weekend Brunch Deal',
      venueName: 'Brunch Spot',
      reviewed: true,
      createdAt: new Date('2024-07-30T09:00:00'),
    },
  ]);

  const toggleReviewed = (id: string) => {
    setReports(
      reports.map((r) =>
        r.id === id ? { ...r, reviewed: !r.reviewed } : r
      )
    );
  };

  const pendingReports = reports.filter((r) => !r.reviewed);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border-default">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="text-accent-primary font-semibold">
            ←
          </Link>
          <h1 className="text-lg font-bold">Report Queue</h1>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {pendingReports.length}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto p-4 space-y-3 pb-20">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`bg-surface p-4 rounded-lg shadow-card ${
              report.reviewed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold uppercase text-accent-primary">
                  {report.type === 'content' ? '📝 Content' : '🏢 Venue'}
                </p>
                <h3 className="font-semibold mt-1">
                  {report.type === 'content' ? report.postTitle : report.venueName}
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={report.reviewed}
                  onChange={() => toggleReviewed(report.id)}
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>

            <p className="text-text-secondary text-sm mb-2">
              Reason: {report.reason}
            </p>
            <p className="text-text-tertiary text-xs">
              Reported by {report.reporter} • {report.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No reports to review</p>
          </div>
        )}
      </main>
    </div>
  );
}
