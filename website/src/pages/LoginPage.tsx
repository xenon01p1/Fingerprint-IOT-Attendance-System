import { useState } from 'react'
import AuthLayout from '../app/layouts/AuthLayout'
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500) // Simulate juicy loading state
  }

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-100">Welcome back</h2>
        <p className="text-neutral-400">Enter your administrator credentials to gain portal entry.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="email">Corporate Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              id="email"
              type="email"
              placeholder="admin@company.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-300" htmlFor="password">Security Password</label>
            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot key?</a>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              required
              className="w-full pl-10 pr-12 py-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded bg-neutral-900 border-neutral-800 text-indigo-600 focus:ring-indigo-500/20"
          />
          <label htmlFor="remember" className="text-sm text-neutral-400 select-none">Keep terminal authenticated</label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-neutral-950 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              Initialize Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  )
}