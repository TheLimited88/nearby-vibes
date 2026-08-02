'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-accounts.module.css';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'customer' | 'venue';
  joinDate: string;
  status: 'active' | 'suspended' | 'inactive';
  subscription?: string;
  posts?: number;
  followers?: number;
}

export default function AdminAccountsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      type: 'customer',
      joinDate: '2024-01-15',
      status: 'active',
      subscription: 'Premium',
      followers: 24,
    },
    {
      id: '2',
      email: 'jane@localbar.com',
      name: 'Jane Smith',
      type: 'venue',
      joinDate: '2024-02-20',
      status: 'active',
      posts: 12,
      followers: 156,
    },
    {
      id: '3',
      email: 'inactive@example.com',
      name: 'Inactive User',
      type: 'customer',
      joinDate: '2023-06-10',
      status: 'inactive',
      subscription: 'Free',
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended' | 'inactive'>('all');

  const handleSuspend = () => {
    if (!selectedUser) return;
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id ? { ...u, status: 'suspended' } : u
      )
    );
    setSelectedUser(null);
  };

  const handleActivate = () => {
    if (!selectedUser) return;
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id ? { ...u, status: 'active' } : u
      )
    );
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === 'all' || u.status === filter;
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    customers: users.filter((u) => u.type === 'customer').length,
    venues: users.filter((u) => u.type === 'venue').length,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Account Management</h1>
      </header>

      <main className={styles.content}>
        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.customers}</div>
            <div className={styles.statLabel}>Customers</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.venues}</div>
            <div className={styles.statLabel}>Venues</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.filterTabs}>
            {(['all', 'active', 'suspended', 'inactive'] as const).map((f) => (
              <button
                key={f}
                className={`${styles.tab} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className={styles.name}>{user.name}</td>
                  <td className={styles.email}>{user.email}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[user.type]}`}>
                      {user.type === 'customer' ? '👤 Customer' : '🏢 Venue'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className={styles.date}>
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Detail Panel */}
      {selectedUser && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>User Details</h2>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>
          </div>

          <div className={styles.panelContent}>
            {/* User Info */}
            <section className={styles.section}>
              <h3>Account Information</h3>
              <div className={styles.info}>
                <div className={styles.field}>
                  <label>Name</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className={styles.field}>
                  <label>Type</label>
                  <p>{selectedUser.type === 'customer' ? 'Customer' : 'Venue Manager'}</p>
                </div>
                <div className={styles.field}>
                  <label>Status</label>
                  <p className={`${styles.status} ${styles[selectedUser.status]}`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </p>
                </div>
                <div className={styles.field}>
                  <label>Joined</label>
                  <p>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            {/* Activity */}
            {selectedUser.type === 'customer' && selectedUser.subscription && (
              <section className={styles.section}>
                <h3>Subscription</h3>
                <div className={styles.info}>
                  <div className={styles.field}>
                    <label>Plan</label>
                    <p>{selectedUser.subscription}</p>
                  </div>
                  {selectedUser.followers !== undefined && (
                    <div className={styles.field}>
                      <label>Followers</label>
                      <p>{selectedUser.followers}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {selectedUser.type === 'venue' && (
              <section className={styles.section}>
                <h3>Venue Activity</h3>
                <div className={styles.info}>
                  {selectedUser.posts !== undefined && (
                    <div className={styles.field}>
                      <label>Posts</label>
                      <p>{selectedUser.posts}</p>
                    </div>
                  )}
                  {selectedUser.followers !== undefined && (
                    <div className={styles.field}>
                      <label>Followers</label>
                      <p>{selectedUser.followers}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Actions */}
          <div className={styles.panelActions}>
            {selectedUser.status === 'active' ? (
              <button className={styles.suspendBtn} onClick={handleSuspend}>
                Suspend Account
              </button>
            ) : (
              <button className={styles.activateBtn} onClick={handleActivate}>
                Reactivate Account
              </button>
            )}
            <button
              className={styles.closeActionBtn}
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Panel Overlay */}
      {selectedUser && (
        <div
          className={styles.overlay}
          onClick={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
