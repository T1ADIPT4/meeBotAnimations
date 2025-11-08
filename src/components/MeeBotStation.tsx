import React, { useState } from 'react';
import MeeBotWelcome from './meebot/MeeBotWelcome';
import dynamic from 'next/dynamic';

// Load preview dynamically to avoid SSR issues
const MeeBotPreview = dynamic(() => import('./MeeBotPreview'), { ssr: false });

export default function MeeBotStation(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar entry — use in your app Sidebar */}
      <button
        className="meebot-sidebar-entry"
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          cursor: 'pointer'
        }}
      >
        <div className="meebot-avatar" aria-hidden>🤖</div>
        <div>
          <div style={{ fontWeight: 600 }}>คุยกับ MeeBot</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>ผู้ช่วยประจำระบบ</div>
        </div>
      </button>

      {/* Floating button visible on all pages */}
      <button
        aria-label="Open MeeBot"
        className="meebot-floating-button"
        onClick={() => setOpen((v) => !v)}
        title="คุยกับ MeeBot"
      >
        <div className="meebot-avatar meebot-pulse">🤖</div>
      </button>

      {/* Slide-in panel */}
      {open && (
        <div className="meebot-panel meebot-slideUp" role="dialog" aria-modal="true">
          <div className="header">
            <MeeBotWelcome />
            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close MeeBot"
                style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="content">
            {/* For demo: show preview selector */}
            <MeeBotPreview />
          </div>
        </div>
      )}
    </>
  );
}
