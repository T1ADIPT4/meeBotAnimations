import React, { useState } from 'react';
import AppLoader from '../components/AppLoader';
import MeeBotAvatar from '../../components/MeeBotAvatar';
import './Welcome.css';

export default function Welcome() {
    const [showContent, setShowContent] = useState(false);

    return (
        <>
            {!showContent && (
                <AppLoader onFinish={() => {
                  console.log('AppLoader finished, showing welcome content');
                  setShowContent(true);
                }} />
            )}
            {showContent && (
                <div className="welcome-container">
                    {/* MeeBotAvatar debug fallback */}
                    <React.Suspense fallback={<span className="meebot-fallback-emoji">🤖</span>}>
                        <MeeBotAvatar style={{ width: 80, height: 80, marginBottom: 16 }} />
                    </React.Suspense>
                    <h1 className="welcome-title">Welcome to MeeChain</h1>
                    <p className="welcome-desc">Start your contributor journey!</p>
                </div>
            )}
        </>
    );
}
