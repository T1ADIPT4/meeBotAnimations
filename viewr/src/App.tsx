import './i18n';
import { useState, useEffect } from 'react';
import RegistryCard from './components/RegistryCard';
import MilestoneChart from './components/MilestoneChart';
import LanguageToggle from './components/LanguageToggle';
import MeeBot from './components/MeeBot';
import './App.css'; // Add this import for styles

// Define the type for questMetadata
type QuestMetadata = {
  owner: string;
  name: string;
  image: string;
  description: string;
  [key: string]: any;
};

export default function App() {
  const [lang, setLang] = useState('th');
  const [registry, setRegistry] = useState<{ version?: string;[key: string]: any }>({});
  // Specify the type for milestones to match the parsed structure (excluding nulls)
  const [milestones, setMilestones] = useState<{ id: string; name: string; msg: string; done: boolean }[]>([]);
  const [questMetadata, setQuestMetadata] = useState<QuestMetadata | null>(null);

  useEffect(() => {
    fetch('/registry.json').then(res => res.json()).then(setRegistry);
    fetch('/milestone.log').then(res => res.text()).then(text => {
      const entries = text.trim().split(/\n(?=M\d+:)/);
      const parsed = entries.map(entry => {
        const firstColonIndex = entry.indexOf(':');
        if (firstColonIndex === -1) return null;
        const id = entry.substring(0, firstColonIndex);
        const msg = entry.substring(firstColonIndex + 1).trim();
        // Add 'name' property, using msg as a fallback
        return { id, name: msg, msg, done: true };
      }).filter(Boolean) as { id: string; name: string; msg: string; done: boolean }[]; // filter out nulls and assert type
      setMilestones(parsed);
    });
    fetch('/copilot/implement-ipfs-uploader/metadata/quest-001.json')
      .then(res => res.json())
      .then(setQuestMetadata);
  }, []);

  const isDataLoading = !milestones.length || !registry.version || !questMetadata;
  const allMilestonesCompleted = milestones.length === 5;

  if (isDataLoading) {
    return (
      <div className="app-loading">
        <img src="/assets/fallback/badge-placeholder.svg" alt="Fallback Viewer" />
        <p>กำลังโหลดข้อมูล MeeChain...</p>
      </div>
    );
  }

  return (
    <div>
      <LanguageToggle lang={lang} setLang={setLang} />
      {questMetadata.owner && (
        <h2 className="app-welcome">
          Welcome, {questMetadata.owner}!
        </h2>
      )}
      <RegistryCard registry={{ name: registry.name ?? '', ...registry }} />
      <div className="app-quest-badge">
        <h3>Quest Badge: {questMetadata.name}</h3>
        <img
          src={allMilestonesCompleted ? questMetadata.image : '/assets/fallback/badge-placeholder.svg'}
          alt={allMilestonesCompleted ? questMetadata.name : 'Badge not yet earned'}
          className="app-badge-img"
        />
        <p><strong>Owner:</strong> {questMetadata.owner}</p>
        <p><strong>Status:</strong> {allMilestonesCompleted ? 'Quest Complete!' : `In Progress (${milestones.length}/5)`}</p>
        <p><strong>Description:</strong> {questMetadata.description}</p>
      </div>
      <MilestoneChart milestones={milestones} />
      <MeeBot milestones={milestones} />
    </div>
  );
}
