import React, { createContext, useState, useContext, ReactNode } from 'react';
// Import MeeBotMood as a type, or define it here if not exported as a type
// import type { MeeBotMood } from '../components/MeeBotSprite';

// Define MeeBotMood type if not available from MeeBotSprite
export type MeeBotMood = 'neutral' | 'happy' | 'sad' | 'angry'; // adjust as needed

interface MeeBotState {
  mood: MeeBotMood;
  message: string;
  moodHistory: MeeBotMood[];
}

interface MeeBotContextType {
  meeBotState: MeeBotState;
  setMeeBot: (mood: MeeBotMood, message: string) => void;
}

const MeeBotContext = createContext<MeeBotContextType | undefined>(undefined);

export const MeeBotProvider = ({ children }: { children: ReactNode }) => {
  const [meeBotState, setMeeBotState] = useState<MeeBotState>({
    mood: 'neutral',
    message: 'สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?',
    moodHistory: [],
  });

  const setMeeBot = (mood: MeeBotMood, message: string) => {
    setMeeBotState((prevState: MeeBotState) => ({
      ...prevState,
      mood: mood,
      message: message,
      moodHistory: [...prevState.moodHistory, mood],
    }));
  };

  return (
    <MeeBotContext.Provider value={{ meeBotState, setMeeBot }}>
      {children}
    </MeeBotContext.Provider>
  );
};

export const useMeeBot = () => {
  const context = useContext(MeeBotContext);
  if (context === undefined) {
    throw new Error('useMeeBot must be used within a MeeBotProvider');
  }
  return context;
};
