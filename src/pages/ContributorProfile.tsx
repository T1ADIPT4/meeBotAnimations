import React, { useState } from 'react';
// import MeeBotKillPanel from '../components/MeeBotKillPanel';
// TODO: Uncomment and update the path below if MeeBotKillPanel exists elsewhere
// import MeeBotKillPanel from './MeeBotKillPanel';

// TODO: Replace this mock with the actual import if FlagReviewPanel exists elsewhere
const FlagReviewPanel = ({
  refundId,
  currentUserAddress,
  onReviewComplete,
}: {
  refundId: string;
  currentUserAddress: string;
  onReviewComplete: (approved: boolean) => void;
}) => (
  <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
    <div>Refund ID: {refundId}</div>
    <div>Reviewer: {currentUserAddress}</div>
    <button onClick={() => onReviewComplete(true)} style={{ marginRight: 8 }}>Approve</button>
    <button onClick={() => onReviewComplete(false)}>Reject</button>
  </div>
);

// If you want to keep the RefundFlag type and other code, move it to AuditorDashboard.tsx

interface RefundFlag {
  refundId: string;
  requester: string;
  transaction: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  flaggedBy: string;
  flaggedAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  notes?: string;
  signatureVerified: boolean;
}

export default function AuditorDashboard() {
  // Badge animation state
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState('');
  const [currentUserAddress] = useState('0x1234567890abcdef');

  // Refund log state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedFlag, setSelectedFlag] = useState<RefundFlag | null>(null);
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  // Handlers for badge animation
  function handleReviewComplete(approved: boolean) {
    console.log('Review completed:', approved);
    setNewBadgeName('Watchdog');
    setShowBadgeAnimation(true);
  }
  const handleBadgeAnimationComplete = () => {
    setTimeout(() => {
      setShowBadgeAnimation(false);
    }, 2000);
  };

  // Handlers for refund log
  const handleSelectFlag = (flag: RefundFlag) => {
    setSelectedFlag(flag);
    setSelectedContributor(flag.flaggedBy);
    const handleCloseDetail = () => {
      setSelectedFlag(null);
    };
    const handleConfirm = () => {
      setSelectedFlag(null);
      const currentFilter = statusFilter;
      setStatusFilter('');
      setTimeout(() => setStatusFilter(currentFilter), 100);
    };
    const handleExportCSV = async () => {
      try {
        const response = await fetch('/api/logs/export-csv');
        const csv = await response.text();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `refund-audit-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert('Failed to export CSV');
      }
    };

    return (
      <div className="auditor-dashboard" style={{ background: '#f7fafc', minHeight: '100vh', paddingBottom: 40 }}>
        <div className="dashboard-header" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 2rem 0 2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a202c' }}>🛡️ Auditor Dashboard</h1>
          <p className="text-gray-600">DAO Governance & Contributor Reputation System</p>
        </div>

        <div>
          {/* Flag Review Section (demo) */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2d3748' }}>📋 Pending Reviews (Demo)</h2>
            <FlagReviewPanel
              refundId="REFUND-2024-001"
              currentUserAddress={currentUserAddress}
              onReviewComplete={handleReviewComplete}
            />
          </div>
          <button
            onClick={() => {
              setNewBadgeName('Champion');
              setShowBadgeAnimation(true);
            }}
            style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
          >🎉 Trigger Badge Animation</button>
        </div>

        {/* Badge Unlock Animation Overlay */}
        {showBadgeAnimation && (
          <>
            <div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
              onClick={() => setShowBadgeAnimation(false)}
            />
            <BadgeUnlockAnimation
              badgeName={newBadgeName}
              onComplete={handleBadgeAnimationComplete}
            />
          </>
        )}

        {/* Footer with snapshot integration info */}
        <div className="dashboard-footer mt-4 bg-white p-4 rounded-lg shadow" style={{ maxWidth: 1200, margin: '2rem auto' }}>
          <h3 className="font-bold mb-2">📎 Snapshot Integration</h3>
          <p className="text-sm text-gray-600 mb-2">
            Use the exported CSV file in your Snapshot proposals for transparent governance decisions.
          </p>
          <div className="bg-gray-100 p-3 rounded text-xs">
            <pre className="whitespace-pre-wrap">{`### Refund Audit Proposal\n\n**ผู้ขอ:** [Requester Address]\n**ธุรกรรม:** [View on BscScan](https://bscscan.com/tx/...)\n**เหตุผล:** [Reason for flag]\n**ลายเซ็น:** ✅ ตรวจสอบแล้ว\n**Log CSV:** [ดาวน์โหลด](https://meechain.xyz/api/logs/export-csv)`}</pre>
          </div>
        </div>
      </div>
    );
    // ...existing code...
    return <div className="error">Contributor not found</div>
  }

  return (
    <div className="contributor-profile">
      <div className="profile-header">
        <h1>👤 Contributor Profile</h1>
        <div className="profile-address">
          {data.name || address}
        </div>
        {/* MeeBot Kill Panel for port/process management */}
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <MeeBotKillPanel />
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Reputation Score</span>
            <span className="stat-value">⭐ {data.score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Badges Earned</span>
            <span className="stat-value">🏅 {data.badges.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Actions Completed</span>
            <span className="stat-value">✅ {data.actions.length}</span>
          </div>
        </div>
      </div>

      <section className="badges-section">
        <h2>🏅 Badges</h2>
        {data.badges.length === 0 ? (
          <p className="empty-state">No badges earned yet. Complete actions to unlock badges!</p>
        ) : (
          <div className="badges-grid">
            {data.badges.map((badge) => (
              <div key={badge.id} className="badge-card">
                <div className="badge-icon">{badge.name}</div>
                <div className="badge-info">
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                  <div className="badge-requirement">
                    Required: {badge.requirement.type} × {badge.requirement.count}
                  </div>
                  {badge.mintedAt && (
                    <div className="badge-minted">
                      Minted: {badge.mintedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sbt-section">
        <h2>📜 Soulbound Tokens</h2>
        {data.sbtTokens.length === 0 ? (
          <p className="empty-state">No SBT tokens minted yet.</p>
        ) : (
          <ul className="sbt-list">
            {data.sbtTokens.map((token) => (
              <li key={token.tokenId} className="sbt-item">
                <div className="sbt-info">
                  <span className="sbt-name">{token.name}</span>
                  <span className="sbt-id">Token ID: {token.tokenId}</span>
                </div>
                <div className="sbt-links">
                  <a
                    href={`https://bscscan.com/token/${token.contractAddress}?a=${token.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sbt-link"
                  >
                    View on BSCScan →
                  </a>
                  {token.metadataURI && (
                    <a
                      href={`https://ipfs.io/ipfs/${token.metadataURI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sbt-link"
                    >
                      View Metadata →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="audit-section">
        <h2>🧾 Audit History</h2>
        {data.auditLogs.length === 0 ? (
          <p className="empty-state">No audit logs yet.</p>
        ) : (
          <div className="audit-list">
            {data.auditLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="audit-item">
                <div className="audit-header">
                  <span className="audit-refund-id">{log.refundId}</span>
                  <span className={`audit-status status-${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </div>
                <div className="audit-details">
                  <span className="audit-action">{log.action}</span>
                  <span className="audit-timestamp">
                    {log.timestamp.toLocaleString()}
                  </span>
                </div>
                <a href={`/logs/${log.refundId}`} className="audit-link">
                  View Details →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="actions-section">
        <h2>📊 Recent Actions</h2>
        {data.actions.length === 0 ? (
          <p className="empty-state">No actions recorded yet.</p>
        ) : (
          <div className="actions-list">
            {data.actions.slice(-10).reverse().map((action, index) => (
              <div key={index} className="action-item">
                <div className="action-type">{action.type.replace('_', ' ')}</div>
                <div className="action-details">
                  {action.refundId && <span>Refund: {action.refundId}</span>}
                  {action.proposalId && <span>Proposal: {action.proposalId}</span>}
                  <span className={action.valid ? 'valid' : 'invalid'}>
                    {action.valid ? '✅ Valid' : '❌ Invalid'}
                  </span>
                </div>
                <div className="action-timestamp">
                  {action.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dao-section">
        <h2>🏛️ DAO Participation</h2>
        <div className="dao-actions">
          <button className="dao-button primary">
            📝 Create New Proposal
          </button>
          <button className="dao-button secondary">
            📊 View My Proposals
          </button>
          <button className="dao-button secondary">
            🗳️ View My Votes
          </button>
        </div>
      </section>
    </div>
  )
}
