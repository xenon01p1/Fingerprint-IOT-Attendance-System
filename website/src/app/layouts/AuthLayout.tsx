import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex antialiased selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden border-r border-neutral-800 items-center justify-center p-12">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-75"></div>
        
        <div className="relative z-10 max-w-md space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/50 text-sm text-indigo-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            v2.4.0 Production Ready
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-indigo-200 to-purple-300">
            Engineered for high performance operations.
          </h1>
          <p className="text-neutral-400 text-lg">
            Monitor real-time system presence, automate reporting structures, and orchestrate workspaces seamlessly.
          </p>
        </div>
      </div>

      {/* Form Content Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}