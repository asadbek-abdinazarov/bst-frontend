<template>
  <div class="students-view">
    <!-- Header -->
    <div class="view-header">
      <div>
        <h1 class="view-title">Talabalar</h1>
        <p class="view-subtitle">Barcha talabalar ro'yxati va ma'lumotlari</p>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAddStudent">
        Talaba qo'shish
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="Ism, familiya yoki ID orqali qidirish"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="filter-options">
        <el-select 
          v-model="courseFilter" 
          placeholder="Kursni tanlang" 
          clearable 
          class="filter-select"
        >
          <el-option label="Frontend Development" value="Frontend Development" />
          <el-option label="Backend (Python)" value="Backend (Python)" />
          <el-option label="UI/UX Design" value="UI/UX Design" />
          <el-option label="Cyber Security" value="Cyber Security" />
        </el-select>
        
        <el-select 
          v-model="statusFilter" 
          placeholder="Holat" 
          clearable 
          class="filter-select"
        >
          <el-option label="Faol" value="active" />
          <el-option label="Faol emas" value="inactive" />
          <el-option label="Bitirgan" value="graduated" />
          <el-option label="Chetlatilgan" value="dropped" />
        </el-select>
      </div>
    </div>

    <!-- Students Grid -->
    <div v-if="paginatedStudents.length > 0" class="students-grid">
      <div 
        v-for="student in paginatedStudents" 
        :key="student.id" 
        class="student-card"
      >
        <div class="card-header">
          <div class="student-status" :class="student.status">
            {{ getStatusLabel(student.status) }}
          </div>
          <el-dropdown trigger="click" @command="(c: any) => handleAction(c, student)">
            <el-button circle size="small" :icon="MoreFilled" class="more-btn" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">
                  <el-icon><Edit /></el-icon>
                  Tahrirlash
                </el-dropdown-item>
                <el-dropdown-item command="status">
                  <el-icon><Refresh /></el-icon>
                  Holatni o'zgartirish
                </el-dropdown-item>
                <el-dropdown-item command="delete" divided style="color: #dc2626;">
                  <el-icon><Delete /></el-icon>
                  O'chirish
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        
        <div class="student-info">
          <div class="avatar-wrapper">
            <img 
              v-if="student.avatar" 
              :src="student.avatar" 
              :alt="student.firstName" 
              class="student-avatar"
            />
            <div v-else class="avatar-placeholder">
              {{ getInitials(student) }}
            </div>
          </div>
          
          <h3 class="student-name">{{ student.firstName }} {{ student.lastName }}</h3>
          <p class="student-id">{{ student.id }}</p>
          
          <div class="info-row">
            <el-icon><Reading /></el-icon>
            <span>{{ student.course }}</span>
          </div>
          <div class="info-row">
            <el-icon><Phone /></el-icon>
            <span>{{ student.phone }}</span>
          </div>
          <div class="info-row">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatDate(student.enrollmentDate) }}</span>
          </div>
        </div>
        
        <div class="card-actions">
          <el-button 
            type="primary" 
            text 
            bg 
            size="small" 
            class="action-btn"
            @click="handleEditStudent(student)"
          >
            Tahrirlash
          </el-button>
          <el-button 
            type="info" 
            text 
            bg 
            size="small" 
            class="action-btn"
            @click="handleViewStudent(student)"
          >
            Ko'rish
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state">
      <el-empty description="Talabalar topilmadi" />
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[8, 12, 16, 24]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredStudents.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </div>

    <!-- Dialogs -->
    <StudentFormDialog
      v-model:visible="showFormDialog"
      :student="selectedStudent"
      @save="handleSaveStudent"
    />

    <StudentDetailsDrawer
      v-model:visible="showDetailsDrawer"
      :student="selectedStudent"
      @edit="handleEditStudent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Plus, 
  Search, 
  MoreFilled, 
  Reading, 
  Phone, 
  Calendar,
  Delete,
  Refresh,
  Edit
} from '@element-plus/icons-vue'
import { mockStudents, type Student } from '@/data/mockStudents'
import { ElMessage, ElMessageBox } from 'element-plus'
import StudentFormDialog from '@/components/students/StudentFormDialog.vue'
import StudentDetailsDrawer from '@/components/students/StudentDetailsDrawer.vue'

// State
const searchQuery = ref('')
const courseFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(8)

// Dialog & Drawer State
const showFormDialog = ref(false)
const showDetailsDrawer = ref(false)
const selectedStudent = ref<Student | null>(null)

// Mutable Mock Data (for demo purposes)
const studentsList = ref<Student[]>([...mockStudents])

// Filter Logic
const filteredStudents = computed(() => {
  return studentsList.value.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCourse = !courseFilter.value || student.course === courseFilter.value
    const matchesStatus = !statusFilter.value || student.status === statusFilter.value
    
    return matchesSearch && matchesCourse && matchesStatus
  })
})

// Pagination Logic
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

// Handlers
const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleAddStudent = () => {
  selectedStudent.value = null
  showFormDialog.value = true
}

const handleEditStudent = (student: Student | null | undefined) => {
  if (!student) return
  selectedStudent.value = { ...student } // Clone to avoid direct mutation
  showFormDialog.value = true
}

const handleViewStudent = (student: Student) => {
  selectedStudent.value = student
  showDetailsDrawer.value = true
}

const handleSaveStudent = (studentData: Partial<Student>) => {
  if (selectedStudent.value && selectedStudent.value.id) {
    // Edit existing
    const index = studentsList.value.findIndex(s => s.id === selectedStudent.value?.id)
    if (index !== -1) {
      studentsList.value[index] = { ...studentsList.value[index], ...studentData }
      ElMessage.success('Talaba ma\'lumotlari yangilandi')
    }
  } else {
    // Add new (Mock ID generation)
    const newStudent: Student = {
      id: `ST-2024-${String(studentsList.value.length + 1).padStart(3, '0')}`,
      firstName: studentData.firstName || '',
      lastName: studentData.lastName || '',
      email: studentData.email || '',
      phone: studentData.phone || '',
      course: studentData.course || '',
      status: (studentData.status as any) || 'active',
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      avatar: undefined // No avatar upload for mock
    }
    studentsList.value.unshift(newStudent)
    ElMessage.success('Yangi talaba qo\'shildi')
  }
}

const handleAction = (command: string, student: Student) => {
  if (command === 'delete') {
    ElMessageBox.confirm(
      `${student.firstName} ${student.lastName}ni o'chirishni tasdiqlaysizmi?`,
      'Ogohlantirish',
      {
        confirmButtonText: "O'chirish",
        cancelButtonText: 'Bekor qilish',
        type: 'warning',
      }
    )
      .then(() => {
        studentsList.value = studentsList.value.filter(s => s.id !== student.id)
        ElMessage({
          type: 'success',
          message: "O'chirildi",
        })
      })
      .catch(() => {
        // cancel
      })
  } else if (command === 'status') {
    ElMessage({
      message: "Status o'zgartirish oynasi (Mock)",
      type: 'info',
    })
  } else if (command === 'edit') {
    handleEditStudent(student)
  }
}

// Helpers
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
.students-view {
  flex: 1;
  padding: 2rem 2rem 1rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    padding: 1rem;
  }
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.view-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  margin-bottom: 0.5rem;
}

.view-subtitle {
  color: #6b7280;
  margin: 0;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.filter-options {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 640px) {
    width: 100%;
    
    .filter-select {
      flex: 1;
    }
  }
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.student-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #d1d5db;
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.student-status {
  font-size: 0.75rem;
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

.more-btn {
  color: #9ca3af;
  border: none;
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
}

.student-info {
  text-align: center;
  margin-bottom: 1.5rem;
  flex: 1;
}

.avatar-wrapper {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.student-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f9fafb;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 4px solid #f9fafb;
}

.student-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem;
}

.student-id {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  
  el-icon {
    color: #9ca3af;
  }
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.action-btn {
  flex: 1;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 1rem;
}

.empty-state {
  padding: 4rem 0;
}
</style>
