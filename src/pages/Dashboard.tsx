import React from 'react';
import ContributorPanel from '../../viewer/components/ContributorPanel';
import QuestTracker from '../../viewer/components/QuestTracker';
// import { BadgeList } from '../../viewer/components/BadgeList'; // BadgeList import commented out due to missing module

// For demo, use a sample user address/id
const sampleUser = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  userId: 'user1',
};

export default function Dashboard() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>MeeChain Dashboard</h1>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <ContributorPanel address={sampleUser.address} />
        </div>
        <div style={{ flex: 1 }}>
          <QuestTracker userAddress={sampleUser.address} />
          {/*
          <div style={{ marginTop: 32 }}>
            <BadgeList userId={sampleUser.userId} />
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
