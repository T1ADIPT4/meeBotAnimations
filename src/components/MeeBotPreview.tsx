import React, { useState } from 'react';
import { animationClasses } from '../lib/meeBotAnimations';

export default function MeeBotPreview(): JSX.Element {
  const [selected, setSelected] = useState(animationClasses[0]);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);

  const copyClass = async () => {
    const text = `className="meebot-avatar ${selected}"`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // fallback: do nothing
      setCopied(false);
    }
  };

  return (
    <div className={`meebot-demo ${dark ? 'dark' : ''}`}>
      <h2 style={{ marginTop: 0 }}>🎨 MeeBot Animation Playground</h2>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div aria-hidden style={{ textAlign: 'center' }}>
          <div className={`meebot-avatar ${selected}`} style={{ fontSize: '3.5rem' }}>
            🤖
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: dark ? '#cbd5e1' : '#64748b' }}>
            Preview
          </div>
        </div>

        <div style={{ minWidth: 240 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>เลือกแอนิเมชัน</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}
          >
            {animationClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={copyClass}
              className="copy-class"
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: '#0ea5e9',
                color: '#fff',
                cursor: 'pointer',
              }}
              aria-label="Copy className"
            >
              {copied ? 'Copied ✓' : 'Copy className'}
            </button>

            <button
              onClick={() => setDark((d) => !d)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                background: dark ? '#0b1220' : '#fff',
                color: dark ? '#e6eef8' : '#0f172a',
                cursor: 'pointer',
              }}
              aria-pressed={dark}
            >
              {dark ? 'Preview: Dark' : 'Preview: Light'}
            </button>
          </div>

          <p style={{ marginTop: 12, fontSize: 13, color: dark ? '#cbd5e1' : '#475569' }}>
            คลาสที่ใช้: <code>{`meebot-avatar ${selected}`}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
