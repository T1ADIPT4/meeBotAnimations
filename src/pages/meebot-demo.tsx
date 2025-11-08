import React from 'react';
import dynamic from 'next/dynamic';
const MeeBotPreview = dynamic(() => import('../components/MeeBotPreview'), { ssr: false });

export default function MeeBotDemoPage(): JSX.Element {
  return (
    <main>
      <MeeBotPreview />
    </main>
  );
}
