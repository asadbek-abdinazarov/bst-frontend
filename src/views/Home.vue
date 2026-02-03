<template>
  <div class="dashboard-container">
    <div class="dashboard-layout">
      <!-- Left Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'sidebar-open': isSidebarMobileOpen }">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <img 
              v-if="!isSidebarCollapsed" 
              src="/images/bst-logo.png" 
              alt="BST Logo" 
              class="logo-full"
            />
            <img 
              v-else 
              src="/images/bst-logo.png" 
              alt="BST" 
              class="logo-icon"
            />
          </div>
          <button 
            class="collapse-btn" 
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            :title="isSidebarCollapsed ? 'Expand' : 'Collapse'"
          >
            <el-icon>
              <DArrowLeft v-if="!isSidebarCollapsed" />
              <DArrowRight v-else />
            </el-icon>
          </button>
        </div>
        <nav class="sidebar-nav">
          <button 
            class="sidebar-item" 
            :class="{ 'sidebar-item-active': route.path === '/' }"
            type="button"
            :title="isSidebarCollapsed ? 'Dashboard' : ''"
            @click="navigateTo('/')"
          >
            <el-icon><Odometer /></el-icon>
            <span v-if="!isSidebarCollapsed">Dashboard</span>
          </button>
          <button 
            class="sidebar-item" 
            type="button"
            :title="isSidebarCollapsed ? 'Fanlar' : ''"
          >
            <el-icon><Reading /></el-icon>
            <span v-if="!isSidebarCollapsed">Fanlar</span>
          </button>
          <button 
            class="sidebar-item" 
            :class="{ 'sidebar-item-active': route.path === '/students' }"
            type="button"
            :title="isSidebarCollapsed ? 'Talabalar' : ''"
            @click="navigateTo('/students')"
          >
            <el-icon><User /></el-icon>
            <span v-if="!isSidebarCollapsed">Talabalar</span>
          </button>
          <button 
            class="sidebar-item" 
            type="button"
            :title="isSidebarCollapsed ? 'O\'qituvchilar' : ''"
          >
            <el-icon><Avatar /></el-icon>
            <span v-if="!isSidebarCollapsed">O'qituvchilar</span>
          </button>
          <button 
            class="sidebar-item" 
            type="button"
            :title="isSidebarCollapsed ? 'Topshiriqlar' : ''"
          >
            <el-icon><Document /></el-icon>
            <span v-if="!isSidebarCollapsed">Topshiriqlar</span>
          </button>
          <button 
            class="sidebar-item" 
            type="button"
            :title="isSidebarCollapsed ? 'Davomat' : ''"
          >
            <el-icon><Calendar /></el-icon>
            <span v-if="!isSidebarCollapsed">Davomat</span>
          </button>
          <button 
            class="sidebar-item" 
            type="button"
            :title="isSidebarCollapsed ? 'Kutubxona' : ''"
          >
            <el-icon><Reading /></el-icon>
            <span v-if="!isSidebarCollapsed">Kutubxona</span>
          </button>
        </nav>
        
        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <!-- Language Switcher -->
          <el-popover
            v-model:visible="showLanguageSwitcher"
            placement="right"
            :width="200"
            trigger="click"
            popper-class="language-popover"
            :show-arrow="false"
            :offset="10"
          >
            <template #reference>
              <button 
                class="sidebar-footer-item" 
                type="button"
                :title="isSidebarCollapsed ? 'Language' : ''"
              >
                <div class="footer-icon-wrapper">
                  <el-icon><Tools /></el-icon>
                </div>
                <div v-if="!isSidebarCollapsed" class="footer-item-content">
                  <span class="footer-item-label">Language</span>
                  <span class="footer-item-value">{{ currentLanguage }}</span>
                </div>
                <el-icon v-if="!isSidebarCollapsed" class="footer-chevron"><ArrowRight /></el-icon>
              </button>
            </template>
            
            <div class="language-options">
              <button 
                class="language-option"
                :class="{ active: locale === 'uz-Latn' }"
                @click="locale = 'uz-Latn'; showLanguageSwitcher = false"
              >
                <span class="lang-flag">🇺🇿</span>
                <span class="lang-name">O'zbekcha (Lotin)</span>
                <el-icon v-if="locale === 'uz-Latn'" class="check-icon"><Check /></el-icon>
              </button>
              <button 
                class="language-option"
                :class="{ active: locale === 'uz-Cyrl' }"
                @click="locale = 'uz-Cyrl'; showLanguageSwitcher = false"
              >
                <span class="lang-flag">🇺🇿</span>
                <span class="lang-name">Ўзбекча (Кирилл)</span>
                <el-icon v-if="locale === 'uz-Cyrl'" class="check-icon"><Check /></el-icon>
              </button>
              <button 
                class="language-option"
                :class="{ active: locale === 'ru' }"
                @click="locale = 'ru'; showLanguageSwitcher = false"
              >
                <span class="lang-flag">🇷🇺</span>
                <span class="lang-name">Русский</span>
                <el-icon v-if="locale === 'ru'" class="check-icon"><Check /></el-icon>
              </button>
            </div>
          </el-popover>
          
          <button 
            class="sidebar-footer-item" 
            type="button"
            :title="isSidebarCollapsed ? (user?.firstName || 'Profile') : ''"
            @click="isProfileDialogVisible = true"
          >
            <div class="user-avatar-small">
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.firstName + ' ' + user.lastName"
                class="avatar-image"
              />
              <span v-else class="avatar-placeholder">
                {{ userInitials }}
              </span>
            </div>
            <div v-if="!isSidebarCollapsed" class="footer-item-content">
              <span class="user-name">
                {{ user?.firstName || 'User' }}
              </span>
              <span class="user-role">Admin</span>
            </div>
            <el-icon v-if="!isSidebarCollapsed" class="footer-chevron"><ArrowRight /></el-icon>
          </button>
        </div>
      </aside>

      <div class="dashboard-main">
        <!-- Mobile sidebar toggle -->
        <el-button
          class="sidebar-toggle-mobile"
          :icon="Menu"
          circle
          @click="isSidebarMobileOpen = !isSidebarMobileOpen"
        />
        
        <!-- Mobile overlay -->
        <div 
          v-if="isSidebarMobileOpen" 
          class="mobile-overlay"
          @click="isSidebarMobileOpen = false"
        />

        <DashboardHeader />

        <router-view />
      </div>
    </div>
    
    <!-- User Profile Dialog -->
    <UserProfileDialog
      v-model="isProfileDialogVisible"
      :user="user"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Reading,
  User,
  Document,
  Calendar,
  Menu,
  Odometer,
  Avatar,
  DArrowLeft,
  DArrowRight,
  Tools,
  ArrowRight,
  Check,
} from '@element-plus/icons-vue'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import UserProfileDialog from '@/components/layout/UserProfileDialog.vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const { locale } = useI18n()
const { user } = useAuth()
const router = useRouter()
const route = useRoute()

const isSidebarCollapsed = ref(false)
const isSidebarMobileOpen = ref(false)
const isProfileDialogVisible = ref(false)
const showLanguageSwitcher = ref(false)

const userInitials = computed(() => {
  if (!user.value?.firstName) return '?'
  const first = user.value.firstName[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last).toUpperCase()
})

const currentLanguage = computed(() => {
  const langMap: Record<string, string> = {
    'uz-Latn': 'UZ',
    'uz-Cyrl': 'ЎЗ',
    'ru': 'РУ'
  }
  return langMap[locale.value] || 'UZ'
})

const navigateTo = (route: string) => {
  router.push(route)
  if (window.innerWidth < 1024) {
    isSidebarMobileOpen.value = false
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  min-height: 100vh;
  background: #f9fafb; // neutral-50
}

.dashboard-layout {
  display: flex;
  position: relative;
}

.dashboard-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; // Prevent horizontal scroll
}

.sidebar-toggle-mobile {
  position: fixed;
  top: 5rem;
  left: 1.5rem;
  z-index: 50;
  border: 1px solid rgba(229, 231, 235, 0.8);
  background-color: white;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (min-width: 1024px) {
    display: none;
  }
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 29;
  
  @media (min-width: 1024px) {
    display: none;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  background: white;
  border-right: 1px solid rgba(229, 231, 235, 0.8);
  padding: 1.5rem 1rem;
  transform: translateX(-100%);
  z-index: 30;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    position: sticky;
    transform: translateX(0);
    top: 0;
    height: 100vh;
    box-shadow: none;
  }
}

.sidebar-collapsed {
  @media (min-width: 1024px) {
    width: 80px;
    
    .sidebar-logo {
      justify-content: center;
    }
    
    .sidebar-item {
      justify-content: center;
      padding: 0.75rem 0.5rem;
    }
    
    .sidebar-footer-item {
      justify-content: center;
      padding: 0.875rem 0.5rem;
      
      span {
        display: none;
      }
    }
  }
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  
  @media (min-width: 1024px) {
    min-height: 100px;
  }
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  padding-top: 0.5rem;
  
  .logo-full {
    height: 120px;
    width: auto;
    object-fit: contain;
  }
  
  .logo-icon {
    height: 45px;
    width: 45px;
    object-fit: contain;
    border-radius: 8px;
  }
}

.collapse-btn {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
  }
  
  @media (min-width: 1024px) {
    display: flex;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  el-icon {
    flex-shrink: 0;
    font-size: 1.75rem;
  }
  
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.sidebar-item-active {
  background: #2563eb;
  color: white;

  &:hover {
    background: #1d4ed8;
    color: white;
  }
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem 0.5rem 0.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-footer-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.2s ease;
  margin-top: 0.25rem;

  &:hover {
    background: #f3f4f6;
  }
}

.footer-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #6b7280;
  
  el-icon {
    font-size: 1.5rem;
  }
}

.footer-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  line-height: 1.3;
}

.footer-item-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.footer-item-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.footer-chevron {
  font-size: 1rem;
  color: #9ca3af;
  margin-left: auto;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e7ff;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4f46e5;
  text-transform: uppercase;
}

.user-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.language-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
}

.language-option {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &.active {
    background: #2563eb;
    color: white;
  }
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;

  @media (max-width: 640px) {
    padding: 0 1rem 1.5rem;
  }
}


</style>
