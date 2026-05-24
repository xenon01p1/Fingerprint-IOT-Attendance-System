import DashboardLayout from '../app/layouts/DashboardLayout'
import { ArrowUpRight, ArrowDownRight, Users, Clock, Activity, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const metrics = [
    { title: 'Total Presence', value: '1,248', change: '+12%', positive: true, icon: Users, glow: 'from-indigo-500/20' },
    { title: 'Avg Shift Time', value: '7h 42m', change: '-2%', positive: false, icon: Clock, glow: 'from-purple-500/20' },
    { title: 'Active Terminals', value: '98.4%', valueSuffix: ' Live', change: '+0.4%', positive: true, icon: Activity, glow: 'from-emerald-500/20' },
  ]

  const records = [
    { user: 'Sarah Connor', role: 'SecOps Lead', time: '08:14 AM', status: 'On Time', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { user: 'James Hudson', role: 'Cloud Engineer', time: '08:45 AM', status: 'Late Threshold', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { user: 'Ellen Ripley', role: 'Director', time: '07:30 AM', status: 'Early Entry', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  ]

  return (
    <DashboardLayout>
      {/* Upper Intro banner area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-16">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">Command Center</h1>
          <p className="text-neutral-400 text-sm mt-0.5">Real-time enterprise metrics orchestration view.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors">
            Export Records
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-colors">
            System Run Override
          </button>
        </div>
      </div>

      {/* METRIC GRID BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {metrics.map((card, i) => (
          <div key={i} className="relative overflow-hidden bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 hover:border-neutral-700/80 transition-all duration-200 group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.glow} to-transparent opacity-40 blur-2xl group-hover:opacity-60 transition-opacity`} />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">{card.title}</span>
              <div className="p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/30 text-neutral-300">
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-100 tracking-tight">{card.value}</span>
              {card.valueSuffix && <span className="text-sm font-semibold text-neutral-500">{card.valueSuffix}</span>}
            </div>
            <div className="mt-2 flex items-center gap-1">
              {card.positive ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
              <span className={`text-xs font-semibold ${card.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{card.change}</span>
              <span className="text-[10px] text-neutral-500 ml-1">since last tracking point</span>
            </div>
          </div>
        ))}
      </div>

      {/* CORE DATA DISPLAY split container grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main tracking mockup graph framework box */}
        <div className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-200">Load Volume Analytics</h3>
              <select className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-xxs px-2 py-1 rounded-md focus:outline-none">
                <option>Active Week</option>
                <option>Previous Week</option>
              </select>
            </div>
            <p className="text-xs text-neutral-500">Simulated analytical performance spikes.</p>
          </div>

          {/* Simple Visual Pure CSS Mockup Graph bars inside layout to retain extreme sleek style */}
          <div className="h-36 flex items-end gap-3 pt-6 px-2">
            {[45, 65, 30, 85, 55, 95, 70, 40, 80, 60, 75, 90].map((height, idx) => (
              <div key={idx} className="flex-1 group relative flex justify-center">
                <div className="absolute bottom-full mb-1.5 bg-neutral-800 border border-neutral-700 text-white font-mono text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {height}%
                </div>
                <div 
                  style={{ height: `${height}%` }} 
                  className={`w-full rounded-t-md transition-all duration-500 group-hover:brightness-110 ${idx === 5 ? 'bg-gradient-to-t from-purple-600 to-pink-500' : 'bg-gradient-to-t from-indigo-600 to-indigo-400'}`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-[10px] text-neutral-500 pt-3 border-t border-neutral-800/60 font-mono">
            <span>00:00 HR</span>
            <span>12:00 HR</span>
            <span>24:00 HR</span>
          </div>
        </div>

        {/* Sidebar Activity Feed lists */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-neutral-200">Recent Entry Events</h3>
            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium">
              View all
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-4">
            {records.map((row, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700/50 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-neutral-200">{row.user}</p>
                  <p className="text-[10px] text-neutral-500">{row.role} • <span className="font-mono text-neutral-400">{row.time}</span></p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${row.badge}`}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}