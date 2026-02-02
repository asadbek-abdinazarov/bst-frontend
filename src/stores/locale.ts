import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n, { type SupportedLocale } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<SupportedLocale>(i18n.global.locale.value as SupportedLocale)

  const setLocale = (locale: SupportedLocale): void => {
    currentLocale.value = locale
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
  }

  const initializeLocale = (): void => {
    try {
      const saved = localStorage.getItem('locale') as SupportedLocale
      if (saved && (saved === 'uz-Latn' || saved === 'uz-Cyrl')) {
        setLocale(saved)
      }
    } catch (error) {
      console.error('Error initializing locale:', error)
    }
  }

  return {
    currentLocale,
    setLocale,
    initializeLocale,
  }
})
