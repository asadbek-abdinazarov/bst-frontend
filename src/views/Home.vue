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
            class="sidebar-item sidebar-item-active" 
            type="button"
            :title="isSidebarCollapsed ? 'Dashboard' : ''"
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
            type="button"
            :title="isSidebarCollapsed ? 'Talabalar' : ''"
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
          <button 
            class="sidebar-footer-item" 
            type="button"
            :title="isSidebarCollapsed ? 'Language' : ''"
            @click="showLanguageSwitcher = !showLanguageSwitcher"
          >
            <el-icon><Tools /></el-icon>
            <span v-if="!isSidebarCollapsed">{{ currentLanguage }}</span>
          </button>
          
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
            <span v-if="!isSidebarCollapsed" class="user-name">
              {{ user?.firstName || 'User' }}
            </span>
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

        <div class="dashboard-content">
          <!-- Stats Cards Section -->
          <div class="stats-grid">
            <StatCard
              :icon="Reading"
              :value="12"
              :label="$t('dashboard.stats.totalCourses')"
              :trend="5"
              icon-color="#3b82f6"
              icon-bg-color="#eff6ff"
            />
            <StatCard
              :icon="User"
              :value="245"
              :label="$t('dashboard.stats.activeStudents')"
              :trend="12"
              icon-color="#22c55e"
              icon-bg-color="#f0fdf4"
            />
            <StatCard
              :icon="Document"
              :value="38"
              :label="$t('dashboard.stats.assignments')"
              :trend="-3"
              icon-color="#f59e0b"
              icon-bg-color="#fffbeb"
            />
            <StatCard
              :icon="Calendar"
              :value="94"
              :label="$t('dashboard.stats.attendance')"
              :trend="2"
              icon-color="#8b5cf6"
              icon-bg-color="#faf5ff"
            />
          </div>

          <!-- Main Content Grid -->
          <div class="content-grid">
            <!-- Recent Activity Section -->
            <div class="activity-card">
              <div class="card-header">
                <h2 class="card-title">{{ $t('dashboard.recentActivity') }}</h2>
                <el-button text type="primary" size="small">
                  {{ $t('dashboard.viewAll') }}
                </el-button>
              </div>
              <div class="activity-list">
                <div v-for="activity in activities" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :style="{ backgroundColor: activity.iconBg }">
                    <el-icon :color="activity.iconColor">
                      <component :is="activity.icon" />
                    </el-icon>
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                </div>
                <div v-if="activities.length === 0" class="no-activity">
                  {{ $t('dashboard.noActivity') }}
                </div>
              </div>
            </div>

            <!-- Quick Actions Section -->
            <div class="actions-card">
              <div class="card-header">
                <h2 class="card-title">{{ $t('dashboard.quickActions') }}</h2>
              </div>
              <div class="actions-grid">
                <el-button
                  :icon="Plus"
                  type="primary"
                  class="action-button"
                  size="large"
                >
                  Yangi kurs
                </el-button>
                <el-button
                  :icon="User"
                  class="action-button"
                  size="large"
                >
                  Talabalar
                </el-button>
                <el-button
                  :icon="Document"
                  class="action-button"
                  size="large"
                >
                  Topshiriqlar
                </el-button>
                <el-button
                  :icon="Calendar"
                  class="action-button"
                  size="large"
                >
                  Davomat
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- User Profile Dialog -->
    <UserProfileDialog
      v-model="isProfileDialogVisible"
      :user="user"
    />
    
    <!-- Language Switcher Dropdown -->
    <el-popover
      v-model:visible="showLanguageSwitcher"
      placement="top"
      :width="150"
      trigger="click"
    >
      <template #reference>
        <span></span>
      </template>
      <div class="language-options">
        <button 
          class="language-option"
          :class="{ active: locale === 'uz-Latn' }"
          @click="locale = 'uz-Latn'; showLanguageSwitcher = false"
        >
          O'zbekcha (Lotin)
        </button>
        <button 
          class="language-option"
          :class="{ active: locale === 'uz-Cyrl' }"
          @click="locale = 'uz-Cyrl'; showLanguageSwitcher = false"
        >
          Ўзбекча (Кирилл)
        </button>
        <button 
          class="language-option"
          :class="{ active: locale === 'ru' }"
          @click="locale = 'ru'; showLanguageSwitcher = false"
        >
          Русский
        </button>
      </div>
    </el-popover>
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
  Plus,
  Menu,
  Odometer,
  Avatar,
  DArrowLeft,
  DArrowRight,
  Tools,
} from '@element-plus/icons-vue'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import UserProfileDialog from '@/components/layout/UserProfileDialog.vue'
import { useAuth } from '@/composables/useAuth'

const { locale } = useI18n()
const { user } = useAuth()

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

// Mock activities data
const activities = ref([
  {
    id: 1,
    title: 'Yangi topshiriq qo\'shildi',
    time: '2 soat oldin',
    icon: Document,
    iconColor: '#3b82f6',
    iconBg: '#eff6ff',
  },
  {
    id: 2,
    title: '5 ta yangi talaba ro\'yxatdan o\'tdi',
    time: '5 soat oldin',
    icon: User,
    iconColor: '#22c55e',
    iconBg: '#f0fdf4',
  },
  {
    id: 3,
    title: 'Davomat yangilandi',
    time: '1 kun oldin',
    icon: Calendar,
    iconColor: '#8b5cf6',
    iconBg: '#faf5ff',
  },
])
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
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  el-icon {
    flex-shrink: 0;
    font-size: 1.25rem;
    color: #6b7280;
  }
  
  .user-avatar-small {
    margin: 0;
  }
  
  .user-name {
    font-weight: 500;
    color: #111827;
  }
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    gap: 1rem;
  }
}

.activity-card,
.actions-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    padding: 1rem;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem; // Mobile
  font-weight: 700;
  color: #1f2933; // neutral-800
  margin: 0;

  @media (min-width: 1024px) {
    font-size: 1.5rem; // Desktop
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb; // neutral-50
  }
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 0.9375rem; // Mobile
  font-weight: 500;
  color: #1f2933; // neutral-800
  margin-bottom: 0.25rem;

  @media (min-width: 1024px) {
    font-size: 1rem; // Desktop
  }
}

.activity-time {
  font-size: 0.8125rem; // Mobile
  color: #6b7280; // neutral-500

  @media (min-width: 1024px) {
    font-size: 0.875rem; // Desktop
  }
}

.no-activity {
  text-align: center;
  padding: 2rem;
  color: #6b7280; // neutral-500
  font-size: 0.875rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.action-button {
  width: 100%;
  height: auto;
  padding: 1rem;
  font-size: 0.9375rem; // Mobile
  justify-content: flex-start;

  @media (min-width: 1024px) {
    font-size: 1rem; // Desktop
  }
}
</style>
