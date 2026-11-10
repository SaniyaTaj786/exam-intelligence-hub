import './globals.css'

export const metadata = {
  title: 'Exam-Hub | Bangalore University Portal',
  description: 'Smart Question Paper Analyzer & Study Guide Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>

      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {/* Premium Global Navigation Bar Header */}
        <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                EH
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">Exam-Hub</h1>
                <p className="text-[10px] text-slate-500 font-medium">Bangalore University Curriculum</p>
              </div>
            </div>
            
            {/* Developer Banner */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Developer:</span>
              <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-100 shadow-3xs">
                Saniya Taj
              </span>
            </div>
          </div>
        </header>

        {/* Core Workspace Injector */}
        <main className="flex-1 bg-slate-50/50">
          {children}
        </main>

        {/* Global System Footer */}
        <footer className="w-full bg-white border-t border-slate-200 py-4 text-center text-[10px] text-slate-400 font-medium mt-auto">
          <p>© 2026 Exam-Hub Portal. Maintained and engineered by Saniya Taj.</p>
        </footer>
      </body>
    </html>
  )
}
