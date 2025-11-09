import React from 'react';

export default function MeeBotAvatar({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      {/* Replace with SVG or image if you have one */}
      <span style={{ fontSize: 80, userSelect: 'none' }} role="img" aria-label="MeeBot">🤖</span>
    </div>
  );
}
