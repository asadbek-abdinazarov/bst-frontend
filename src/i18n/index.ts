import { createI18n } from 'vue-i18n'
import uzLatn from './locales/uz-Latn.json'
import uzCyrl from './locales/uz-Cyrl.json'

export type SupportedLocale = 'uz-Latn' | 'uz-Cyrl'

const messages = {
  'uz-Latn': uzLatn,
  'uz-Cyrl': uzCyrl,
}

// Get saved locale from localStorage or default to Uzbek Latin
const getDefaultLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') {
    return 'uz-Latn'
  }
  try {
    const saved = localStorage.getItem('locale') as SupportedLocale
    return saved && (saved === 'uz-Latn' || saved === 'uz-Cyrl') ? saved : 'uz-Latn'
  } catch {
    return 'uz-Latn'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'uz-Latn',
  messages,
})

export default i18n
