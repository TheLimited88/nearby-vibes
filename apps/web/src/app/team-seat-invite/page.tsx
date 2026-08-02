'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './team-seat-invite.module.css';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'staff';
  status: 'active' | 'invited' | 'pending';
  joinedAt?: string;
}

interface Invite {
  email: string;
  role: 'manager' | 'staff';
}

export default function TeamSeatInvitePage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'owner@venue.com',
      name: 'John Doe',
      role: 'manager',
      status: 'active',
      joinedAt: '2024-01-15',
    },
  ]);

  const [invites, setInvites] = useState<Invite[]>([]);
  const [newInvite, setNewInvite] = useState<Invite>({ email: '', role: 'staff' });
  const [inviteSent, setInviteSent] = useState<string | null>(null);

  const handleAddInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvite.email.trim()) return;

    // Check if already invited or member
    if (
      teamMembers.some((m) => m.email === newInvite.email) ||
      invites.some((i) => i.email === newInvite.email)
    ) {
      alert('This person is already a team member or invited');
      return;
    }

    setInvites([...invites, newInvite]);
    setInviteSent(newInvite.email);
    setNewInvite({ email: '', role: 'staff' });

    // Clear success message
    setTimeout(() => setInviteSent(null), 3000);
  };

  const handleCancelInvite = (email: string) => {
    setInvites(invites.filter((i) => i.email !== email));
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Remove this team member? They will lose access to this venue.')) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <img src="/nv-icon.png" alt="Nearby Vibes" className={styles.logo} />
        <h1 className={styles.title}>Team Management</h1>
      </header>

      <main className={styles.content}>
        {/* Invite Form */}
        <section className={styles.inviteSection}>
          <h2>Invite Team Members</h2>
          <p className={styles.sectionDesc}>
            Add managers and staff to help run your venue on Nearby Vibes
          </p>

          <form onSubmit={handleAddInvite} className={styles.inviteForm}>
            <div className={styles.formRow}>
              <input
                type="email"
                placeholder="team.member@email.com"
                value={newInvite.email}
                onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                className={styles.input}
                required
              />
              <select
                value={newInvite.role}
                onChange={(e) => {
                  const role = (e.target.value === 'manager' ? 'manager' : 'staff') as 'manager' | 'staff';
                  setNewInvite({ ...newInvite, role });
                }}
                className={styles.select}
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
              <button type="submit" className={styles.inviteBtn}>
                Send Invite
              </button>
            </div>
          </form>

          {inviteSent && (
            <div className={styles.successMsg}>
              ✓ Invite sent to {inviteSent}
            </div>
          )}
        </section>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Pending Invites</h3>
            <div className={styles.membersList}>
              {invites.map((invite) => (
                <div key={invite.email} className={styles.memberCard}>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{invite.email}</div>
                    <div className={styles.memberMeta}>
                      <span className={styles.role}>{invite.role}</span>
                      <span className={styles.status}>Invitation pending</span>
                    </div>
                  </div>
                  <button
                    className={styles.cancelInviteBtn}
                    onClick={() => handleCancelInvite(invite.email)}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Current Team */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Current Team ({teamMembers.length})
          </h3>
          <div className={styles.membersList}>
            {teamMembers.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberInfo}>
                  <div className={styles.memberName}>{member.name}</div>
                  <div className={styles.memberEmail}>{member.email}</div>
                  <div className={styles.memberMeta}>
                    <span className={styles.role}>{member.role}</span>
                    {member.joinedAt && (
                      <span className={styles.joinDate}>
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {member.role !== 'manager' && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Roles Info */}
        <section className={styles.rolesInfo}>
          <h3>Role Permissions</h3>
          <div className={styles.roleCard}>
            <h4>Manager</h4>
            <ul>
              <li>Post specials and manage posts</li>
              <li>View analytics and reports</li>
              <li>Manage team members</li>
              <li>Update venue information</li>
            </ul>
          </div>
          <div className={styles.roleCard}>
            <h4>Staff</h4>
            <ul>
              <li>Post specials and manage posts</li>
              <li>View basic analytics</li>
              <li>Cannot manage team members</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
