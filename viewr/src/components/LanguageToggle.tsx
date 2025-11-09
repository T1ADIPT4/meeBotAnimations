type LanguageToggleProps = {
  lang: string;
  setLang: (lang: string) => void;
};

export default function LanguageToggle({ lang, setLang }: LanguageToggleProps) {
  return (
    <div>
      {/* Example usage to avoid unused errors */}
      <span>Current language: {lang}</span>
      <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')}>
        Toggle Language
      </button>
    </div>
  );
}
