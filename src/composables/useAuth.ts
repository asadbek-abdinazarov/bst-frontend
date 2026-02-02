import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { LoginCredentials } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)
      router.push('/')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authStore.logout()
    router.push('/login')
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    login,
    logout,
  }
}
