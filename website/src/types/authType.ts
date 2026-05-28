// import { useAuthStore, type AuthUser } from '../store/authStore'
import type { AuthUser } from "../store/authStore"

export type LoginResponse = {
  status: boolean
  message: string
  data: AuthUser & {
    accessToken: string
    refreshToken: string
  }
}
