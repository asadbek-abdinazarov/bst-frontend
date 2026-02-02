import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './styles/tailwind.css'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

// Register Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus)

// Error handling
app.config.errorHandler = (err, _instance, info) => {
  console.error('Vue error:', err, info)
}

try {
  app.mount('#app')
  console.log('App mounted successfully')
} catch (error) {
  console.error('Failed to mount app:', error)
}
