<template>
  <div class="stat-card">
    <div class="stat-card-icon" :style="{ backgroundColor: iconBgColor }">
      <el-icon :size="24" :color="iconColor">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-card-content">
      <div class="stat-card-value">{{ value }}</div>
      <div class="stat-card-label">{{ label }}</div>
      <div v-if="trend" class="stat-card-trend" :class="trendClass">
        <el-icon :size="12">
          <ArrowUp v-if="trend > 0" />
          <ArrowDown v-else />
        </el-icon>
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

interface Props {
  icon: any
  value: string | number
  label: string
  trend?: number
  iconColor?: string
  iconBgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: '#3b82f6', // primary-500
  iconBgColor: '#eff6ff', // primary-50
  trend: undefined,
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0 ? 'trend-up' : 'trend-down'
})
</script>

<style scoped lang="scss">
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card-content {
  flex: 1;
  min-width: 0;
}

.stat-card-value {
  font-size: 1.875rem; // Mobile
  font-weight: 700;
  color: #1f2933; // neutral-800
  line-height: 1.2;
  margin-bottom: 0.25rem;

  @media (min-width: 1024px) {
    font-size: 2.25rem; // Desktop
  }
}

.stat-card-label {
  font-size: 0.875rem; // Mobile
  color: #6b7280; // neutral-500
  margin-bottom: 0.5rem;

  @media (min-width: 1024px) {
    font-size: 1rem; // Desktop
  }
}

.stat-card-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.trend-up {
    color: #22c55e; // success
  }

  &.trend-down {
    color: #ef4444; // danger
  }
}
</style>
