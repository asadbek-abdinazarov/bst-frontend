<template>
  <el-drawer
    :model-value="visible"
    title="Talaba ma'lumotlari"
    direction="rtl"
    size="40%"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <div v-if="student" class="student-details">
      <div class="header-section">
        <div class="avatar-large">
          <img 
            v-if="student.avatar" 
            :src="student.avatar" 
            :alt="student.firstName" 
          />
          <div v-else class="avatar-placeholder-large">
            {{ getInitials(student) }}
          </div>
        </div>
        <div class="header-info">
          <h2>{{ student.firstName }} {{ student.lastName }}</h2>
          <p class="id-text">{{ student.id }}</p>
          <div class="status-badge" :class="student.status">
            {{ getStatusLabel(student.status) }}
          </div>
        </div>
      </div>
      
      <el-divider />
      
      <div class="info-section">
        <h3>Asosiy ma'lumotlar</h3>
        <dl class="info-list">
          <div class="info-item">
            <dt>Email</dt>
            <dd>{{ student.email }}</dd>
          </div>
          <div class="info-item">
            <dt>Telefon</dt>
            <dd>{{ student.phone }}</dd>
          </div>
          <div class="info-item">
            <dt>Kurs</dt>
            <dd>{{ student.course }}</dd>
          </div>
          <div class="info-item">
            <dt>Qabul qilingan sana</dt>
            <dd>{{ formatDate(student.enrollmentDate) }}</dd>
          </div>
        </dl>
      </div>

      <div class="info-section">
        <h3>Qo'shimcha</h3>
        <p class="description-text">
          Bu talaba haqida qo'shimcha ma'lumotlar hozircha mavjud emas. 
          Kelajakda bu yerda to'lovlar tarixi, davomat va o'zlashtirish ko'rsatkichlari bo'lishi mumkin.
        </p>
      </div>
    </div>
    
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="emit('update:visible', false)">Yopish</el-button>
        <el-button type="primary" @click="emit('edit', student)">Tahrirlash</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { Student } from '@/data/mockStudents'

defineProps<{
  visible: boolean
  student?: Student | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'edit', student: Student | null | undefined): void
}>()

const getInitials = (student: Student) => {
  return (student.firstName[0] + student.lastName[0]).toUpperCase()
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Faol',
    inactive: 'Faol emas',
    graduated: 'Bitirgan',
    dropped: 'Chetlatilgan'
  }
  return labels[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped lang="scss">
.student-details {
  padding: 0 1rem;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar-large {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
}

.avatar-placeholder-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-info {
  h2 {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    color: #111827;
  }
  
  .id-text {
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  }
}

.status-badge {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  
  &.active {
    background: #ecfdf5;
    color: #059669;
  }
  
  &.inactive {
    background: #fef2f2;
    color: #dc2626;
  }
  
  &.graduated {
    background: #eff6ff;
    color: #2563eb;
  }
  
  &.dropped {
    background: #f3f4f6;
    color: #4b5563;
  }
}

.info-section {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
}

.info-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  dt {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  dd {
    margin: 0;
    font-size: 1rem;
    color: #111827;
    font-weight: 500;
  }
}

.description-text {
  color: #6b7280;
  line-height: 1.5;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 640px) {
  .header-section {
    flex-direction: column;
    text-align: center;
  }
  
  .info-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
