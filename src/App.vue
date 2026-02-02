<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'

const authStore = useAuthStore()
const localeStore = useLocaleStore()

onMounted(() => {
  try {
    authStore.initializeAuth()
    localeStore.initializeLocale()
  } catch (error) {
    console.error('Error initializing app:', error)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
