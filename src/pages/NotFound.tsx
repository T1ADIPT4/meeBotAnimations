import React from 'react';
import './NotFound.css';
import { useNavigate } from 'react-router-dom';
import MeeBotAvatar from '../../components/MeeBotAvatar';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="not-found-container">
            <MeeBotAvatar style={{ width: 120, height: 120, marginBottom: 16 }} />
            <h1>404</h1>
            <p>ขออภัย ไม่พบหน้าที่คุณต้องการ</p>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: 24,
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
            >
                กลับหน้าแรก
            </button>
        </div>
    );
}
