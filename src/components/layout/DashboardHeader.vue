<template>
  <div class="dashboard-header">
    <div class="header-content">
      <div class="header-greeting">
        <h1 class="greeting-text">
          {{ $t('dashboard.greeting') }}!
        </h1>
        <p class="greeting-subtitle">{{ $t('dashboard.welcome') }}</p>
      </div>
      <!-- Moved to sidebar footer
      <div class="header-actions">
        <LanguageSwitcher />
        <div class="user-profile-section">
          <div
            class="user-avatar clickable"
            @click="openProfileDialog"
          >
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
        </div>
      </div>
      -->
    </div>
  </div>

  <UserProfileDialog
    v-model="isProfileDialogVisible"
    :user="user"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import UserProfileDialog from './UserProfileDialog.vue'

const { user } = useAuth()

const isProfileDialogVisible = ref(false)
</script>

<style scoped lang="scss">
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e5e7eb; // neutral-200
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    padding: 1rem 1.5rem;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.header-greeting {
  flex: 1;
}

.greeting-text {
  font-size: 1.5rem; // Mobile
  font-weight: 700;
  color: #1f2933; // neutral-800
  margin: 0 0 0.25rem 0;

  @media (min-width: 640px) {
    font-size: 1.75rem; // Tablet
  }

  @media (min-width: 1024px) {
    font-size: 2rem; // Desktop
  }
}

.greeting-subtitle {
  font-size: 0.875rem; // Mobile
  color: #6b7280; // neutral-500
  margin: 0;

  @media (min-width: 1024px) {
    font-size: 1rem; // Desktop
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-profile-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e7ff;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &.clickable {
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4f46e5;
  text-transform: uppercase;
}

.logout-button {
  border-color: #e5e7eb; // neutral-200
  color: #374151; // neutral-700

  &:hover {
    border-color: #ef4444; // danger
    color: #ef4444; // danger
    background-color: #fef2f2;
  }
}
</style>
