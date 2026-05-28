import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../app/layouts/AuthLayout'
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Swal from 'sweetalert2'
import { fetcher } from '../services/fetcher'
import { useAuthStore } from '../store/authStore'
import type { LoginResponse } from '../types/authType'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await fetcher<LoginResponse>('/api/auth/login', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const {
        accessToken,
        refreshToken,
        ...user
      } = response.data

      setAuth({
        user,
        accessToken,
        refreshToken,
      })

      await Swal.fire({
        icon: 'success',
        title: 'Login berhasil',
        text: response.message || 'Admin logged in successfully',
        timer: 1200,
        showConfirmButton: false,
      })

      navigate('/dashboard')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login gagal',
        text: error instanceof Error ? error.message : 'Username atau password salah',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-100">
          Welcome back
        </h2>
        <p className="text-neutral-400">
          Enter your administrator credentials to gain portal entry.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="username">
            Username
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              id="username"
              type="text"
              placeholder="test"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-300" htmlFor="password">
              Security Password
            </label>
            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot key?
            </a>
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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