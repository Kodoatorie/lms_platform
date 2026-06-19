'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '../../../i18n/dictionaries';
import { getLocale } from '../../../lib/i18n/useTranslation';
import { 
  Code2, 
  Sparkles, 
  UserCheck, 
  Flame, 
  GitFork, 
  Briefcase, 
  Play, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const ICON_MAP = {
  sandbox: Code2,
  autograder: Sparkles,
  review: UserCheck,
  gamification: Flame,
  github: GitFork,
  career: Briefcase,
};

export default function FeaturesClient({ locale }: { locale: string }) {
  const [activeLocale, setActiveLocale] = useState(locale);
  const [code, setCode] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const currentLocale = getLocale();
    if (currentLocale && currentLocale !== activeLocale) {
      setActiveLocale(currentLocale);
    }
  }, []);

  const normalizedLocale = activeLocale === 'kz' ? 'kk' : activeLocale;
  const t = getDictionary(normalizedLocale);

  // Set default code template when localized data is loaded
  useEffect(() => {
    setCode(t.features.editorPlaceholder);
  }, [activeLocale, t.features.editorPlaceholder]);

  const handleRunTests = () => {
    setTestStatus('testing');
    
    setTimeout(() => {
      try {
        // Simple evaluation to check if sum(a, b) returns correct sum
        // We look for function sum in the code block
        const cleanCode = code.replace(/function\s+sum\s*\(/, 'function _sum(');
        const evalFn = new Function('a', 'b', `
          ${cleanCode};
          if (typeof sum !== 'undefined') return sum(a, b);
          if (typeof _sum !== 'undefined') return _sum(a, b);
          throw new Error('Function sum is not defined');
        `);
        
        const result1 = evalFn(2, 3);
        const result2 = evalFn(-1, 5);

        if (result1 === 5 && result2 === 4) {
          setTestStatus('success');
          setErrorDetails('');
        } else {
          setTestStatus('fail');
          setErrorDetails(`sum(2, 3) returned ${result1} instead of 5`);
        }
      } catch (err: any) {
        setTestStatus('fail');
        setErrorDetails(err.message || 'Syntax Error');
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-400 blur-[120px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-300 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-5xl text-center mt-8 mb-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50 mb-4 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          LMS for Students
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 mb-6 tracking-tight">
          {t.features.title}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 sm:text-xl font-normal leading-relaxed">
          {t.features.subtitle}
        </p>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {t.features.items.map((item) => {
          const Icon = ICON_MAP[item.id as keyof typeof ICON_MAP] || Code2;
          return (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Live Code Sandbox Demo */}
      <section className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 border border-slate-800/80 shadow-2xl overflow-hidden">
        {/* Glow behind section */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px]" />

        <div className="text-center sm:text-left mb-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {t.features.interactiveTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            {t.features.interactiveSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
          {/* Code Editor Window */}
          <div className="lg:col-span-3 bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg flex flex-col">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-500">solution.js</span>
            </div>

            {/* Code Textarea */}
            <div className="relative flex-grow min-h-[220px] font-mono text-sm p-4 text-emerald-400">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none p-4 font-mono text-slate-200 border-none focus:ring-0 selection:bg-indigo-500/30"
                spellCheck="false"
              />
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-900 flex justify-end">
              <button
                onClick={handleRunTests}
                disabled={testStatus === 'testing'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                {testStatus === 'testing' ? t.features.editorTesting : t.features.editorRun}
              </button>
            </div>
          </div>

          {/* Test Runner / Output */}
          <div className="lg:col-span-2 bg-slate-950/50 rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-4">
                Test Output
              </span>

              {testStatus === 'idle' && (
                <div className="text-slate-400 text-sm flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2" />
                  <span>Click "Run Tests" to evaluate your function.</span>
                </div>
              )}

              {testStatus === 'testing' && (
                <div className="text-indigo-400 text-sm animate-pulse flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>{t.features.editorTesting}</span>
                </div>
              )}

              {testStatus === 'success' && (
                <div className="text-emerald-400 text-sm space-y-2">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{t.features.editorSuccess}</span>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2.5 text-xs text-emerald-300 font-mono mt-2">
                    ✓ testSum(2, 3) passed<br />
                    ✓ testSum(-1, 5) passed
                  </div>
                </div>
              )}

              {testStatus === 'fail' && (
                <div className="text-rose-400 text-sm space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{t.features.editorFail}{errorDetails}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-mono flex justify-between items-center">
              <span>Environment: Node.js</span>
              <span>Tests: 2/2</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
