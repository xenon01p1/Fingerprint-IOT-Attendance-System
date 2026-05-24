import { useState } from 'react'
import type { ReactNode } from 'react'
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Cpu, 
  CalendarDays, 
  History,
  X,
  LogOut,
  Menu,
  Search,
  Command,
  Bell
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard, 
      active: true 
    },
    { 
      name: 'Admin', 
      href: '/admin', 
      icon: ShieldCheck, 
      active: false, 
      badge: 'ONGOING' 
    },
    { 
      name: 'Employee', 
      href: '/employee', 
      icon: Users, 
      active: false 
    },
    { 
      name: 'Device', 
      href: '/device', 
      icon: Cpu, 
      active: false 
    },
    { 
      name: 'Attendance Monitor', 
      href: '/attendance', 
      icon: CalendarDays, 
      active: false 
    },
    { 
      name: 'Log Device', 
      href: '/log-device', 
      icon: History, 
      active: false 
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex antialiased">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR BLOCK */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800/60 z-50 transform lg:transform-none lg:opacity-100 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header Title Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-xs font-black text-white">Ω</span>
            </div>
            <span className="font-bold tracking-tight text-neutral-100">CorePortal</span>
          </div>
          <button className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group duration-200 ${item.active ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400' : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${item.active ? 'text-indigo-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                {item.name}
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Footer Admin Node Profile */}
        <div className="p-4 border-t border-neutral-800/60 bg-neutral-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/40 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center text-sm font-semibold text-neutral-200">
                AD
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-200 leading-none">Admin Cluster</p>
                <p className="text-[10px] text-neutral-500 mt-1">ID: #88094</p>
              </div>
            </div>
            <button className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT BODY */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        
        {/* HEADER BLOCK */}
        <header className="h-16 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button className="p-2 -ml-2 rounded-lg hover:bg-neutral-900 text-neutral-400 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Command Search Bar */}
            <div className="hidden sm:flex items-center gap-2 w-full max-w-sm px-3 py-1.5 bg-neutral-900/60 border border-neutral-800 rounded-xl text-neutral-500 text-sm group focus-within:border-neutral-700 transition-colors">
              <Search className="w-4 h-4 group-focus-within:text-neutral-400 transition-colors" />
              <input type="text" placeholder="Search terminal modules..." className="bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 text-xs w-full focus:ring-0" />
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-neutral-400">
                <Command className="w-2.5 h-2.5" />K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Trigger Icon */}
            <button className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </button>
            
            <div className="w-px h-6 bg-neutral-800"></div>
            
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Secure Gateway
            </span>
          </div>
        </header>

        {/* Content Injector Point */}
        <main className="flex-1 pt-16 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}