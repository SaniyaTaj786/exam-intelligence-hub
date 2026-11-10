'use client';

import { useState } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 antialiased flex flex-col transition-colors duration-300">
        {/* Premium Global Navigation Bar Header */}
        <header className="w-full bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700 sticky top-0 z-50 shadow-xs transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                EH
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Exam-Hub</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bangalore University Curriculum</p>
              </div>
            </div>
            
            {/* Header Right Elements Control Panel */}
            <div className="flex items-center space-x-4">
              {/* Modern Theme Switcher Button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all text-xs font-bold flex items-center space-x-1.5 shadow-3xs"
              >
                <span>{darkMode ? '☀️ Light' : '🌙 Dark'}</span>
              </button>

              {/* Developer Banner */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">Lead Developer:</span>
                <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 shadow-3xs">
                  Saniya Taj
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Core Workspace Injector */}
        <main className="flex-1 bg-slate-50/50 dark:bg-slate-900/40 transition-colors duration-300">
          {children}
        </main>

        {/* Global System Footer */}
        <footer className="w-full bg-white border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700 py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-auto transition-colors duration-300">
          <p>© 2026 Exam-Hub Portal. Maintained and engineered by Saniya Taj.</p>
        </footer>
      </body>
    </html>
  );
}
