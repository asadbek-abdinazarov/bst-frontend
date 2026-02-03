<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Reading,
  User,
  Document,
  Calendar,
  Plus,
} from '@element-plus/icons-vue'
import StatCard from '@/components/common/StatCard.vue'

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
