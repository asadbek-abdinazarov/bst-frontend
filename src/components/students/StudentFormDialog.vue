<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? 'Talabani tahrirlash' : 'Yangi talaba qo\'shish'"
    width="600px"
    @update:model-value="emit('update:visible', $event)"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="form-grid">
        <el-form-item label="Ism" prop="firstName">
          <el-input v-model="formData.firstName" placeholder="Ismni kiriting" />
        </el-form-item>
        
        <el-form-item label="Familiya" prop="lastName">
          <el-input v-model="formData.lastName" placeholder="Familiyani kiriting" />
        </el-form-item>
        
        <el-form-item label="Email" prop="email">
          <el-input v-model="formData.email" placeholder="Email manzilini kiriting" />
        </el-form-item>
        
        <el-form-item label="Telefon raqam" prop="phone">
          <el-input v-model="formData.phone" placeholder="+998 90 123 45 67" />
        </el-form-item>
        
        <el-form-item label="Kurs" prop="course">
          <el-select v-model="formData.course" placeholder="Kursni tanlang" style="width: 100%">
            <el-option label="Frontend Development" value="Frontend Development" />
            <el-option label="Backend (Python)" value="Backend (Python)" />
            <el-option label="UI/UX Design" value="UI/UX Design" />
            <el-option label="Cyber Security" value="Cyber Security" />
            <el-option label="Mobile (Flutter)" value="Mobile (Flutter)" />
            <el-option label="Backend (Java)" value="Backend (Java)" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Holati" prop="status">
          <el-select v-model="formData.status" placeholder="Holatni tanlang" style="width: 100%">
            <el-option label="Faol" value="active" />
            <el-option label="Faol emas" value="inactive" />
            <el-option label="Bitirgan" value="graduated" />
            <el-option label="Chetlatilgan" value="dropped" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Qabul qilingan sana" prop="enrollmentDate">
          <el-date-picker
            v-model="formData.enrollmentDate"
            type="date"
            placeholder="Sanani tanlang"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </div>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('update:visible', false)">Bekor qilish</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? 'Saqlash' : 'Qo\'shish' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Student } from '@/data/mockStudents'

const props = defineProps<{
  visible: boolean
  student?: Student | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', student: Partial<Student>): void
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const isEdit = computed(() => !!props.student)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  course: '',
  status: 'active',
  enrollmentDate: new Date().toISOString().split('T')[0]
})

const rules = reactive<FormRules>({
  firstName: [
    { required: true, message: 'Ism kiritilishi shart', trigger: 'blur' },
    { min: 2, message: 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Familiya kiritilishi shart', trigger: 'blur' },
    { min: 2, message: 'Familiya kamida 2 ta harfdan iborat bo\'lishi kerak', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email kiritilishi shart', trigger: 'blur' },
    { type: 'email', message: 'Email noto\'g\'ri formatda', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Telefon raqam kiritilishi shart', trigger: 'blur' }
  ],
  course: [
    { required: true, message: 'Kurs tanlanishi shart', trigger: 'change' }
  ],
  status: [
    { required: true, message: 'Holat tanlanishi shart', trigger: 'change' }
  ],
  enrollmentDate: [
    { required: true, message: 'Sana tanlanishi shart', trigger: 'change' }
  ]
})

watch(
  () => props.visible,
  (val) => {
    if (val && props.student) {
      // Edit mode: populate form
      Object.assign(formData, {
        firstName: props.student.firstName,
        lastName: props.student.lastName,
        email: props.student.email,
        phone: props.student.phone,
        course: props.student.course,
        status: props.student.status,
        enrollmentDate: props.student.enrollmentDate
      })
    } else if (val) {
      // Create mode: reset form defaults
      resetForm()
    }
  }
)

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  Object.assign(formData, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    status: 'active',
    enrollmentDate: new Date().toISOString().split('T')[0]
  })
}

const handleClosed = () => {
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      // Simulate API call
      setTimeout(() => {
        emit('save', { ...formData } as any)
        loading.value = false
        emit('update:visible', false)
      }, 500)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped lang="scss">
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

:deep(.el-form-item) {
  width: 100%;
}
</style>
