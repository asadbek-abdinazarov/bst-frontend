<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    class="modern-profile-dialog"
    :show-close="false"
    align-center
    destroy-on-close
    @close="resetForm"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="custom-dialog-header">
        <span :id="titleId" :class="titleClass">
          {{ isEditing ? $t('profile.editProfile') : $t('profile.myProfile') }}
        </span>
        <el-button circle text @click="dialogVisible = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </template>

    <div class="profile-container" v-if="localUser">
      <main class="profile-main full-width">
        <div v-if="!isEditing" class="info-view">
          <div class="profile-summary">
            <div class="avatar-circle">
              <img v-if="localUser.avatar" :src="localUser.avatar" alt="Avatar" />
              <span v-else class="avatar-initials">{{ userInitials }}</span>
            </div>
            <div class="summary-text">
              <h2 class="user-fullname">{{ localUser.firstName }} {{ localUser.lastName }}</h2>
              <p class="user-email">{{ localUser.email }}</p>
              <div class="summary-meta">
                <el-tag :type="roleTagType" effect="dark" round class="role-badge">
                  {{ formatRole(localUser.role) }}
                </el-tag>
                <!-- <span class="joined-text">{{ $t('profile.joined') }}: {{ formatDateShort(localUser.createdAt) }}</span> -->
              </div>
            </div>
            <div class="summary-actions">
              <el-button type="primary" @click="startEditing">
                {{ $t('profile.edit') }} <el-icon class="el-icon--right"><Edit /></el-icon>
              </el-button>
              <el-button type="danger" plain @click="handleLogout">
                {{ $t('profile.logout') }}
              </el-button>
            </div>
          </div>

          <el-divider content-position="left">
            <span class="divider-text">{{ $t('profile.personalDetails') }}</span>
          </el-divider>
          <div class="info-list">
            <div class="info-row">
              <label>{{ $t('profile.firstName') }}</label>
              <p>{{ localUser.firstName || $t('profile.emptyValue') }}</p>
            </div>
            <div class="info-row">
              <label>{{ $t('profile.lastName') }}</label>
              <p>{{ localUser.lastName || $t('profile.emptyValue') }}</p>
            </div>
          </div>
          <div class="info-list">
            <div class="info-row">
              <label>{{ $t('profile.phone') }}</label>
              <p>{{ localUser.phone || $t('profile.emptyValue') }}</p>
            </div>
            <div class="info-row">
              <label>{{ $t('profile.address') }}</label>
              <p>{{ localUser.address || $t('profile.noAddress') }}</p>
            </div>
          </div>
          <div class="info-list">
            <div class="info-row">
              <label>{{ $t('profile.passport') }}</label>
              <div class="doc-value-row">
                <span class="mono-font">{{ localUser.passport || $t('profile.emptyValue') }}</span>
                <el-tooltip :content="$t('profile.copy')" placement="top">
                  <el-button
                    class="copy-btn"
                    text
                    circle
                    :disabled="!localUser.passport"
                    @click="copyValue('passport', localUser.passport)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="info-row">
              <label>{{ $t('profile.pinfl') }}</label>
              <div class="doc-value-row">
                <span class="mono-font">{{ localUser.pinfl || $t('profile.emptyValue') }}</span>
                <el-tooltip :content="$t('profile.copy')" placement="top">
                  <el-button
                    class="copy-btn"
                    text
                    circle
                    :disabled="!localUser.pinfl"
                    @click="copyValue('pinfl', localUser.pinfl)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="info-edit">
          <div class="section-header">
            <h3>{{ $t('profile.editMode') }}</h3>
          </div>
          
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            hide-required-asterisk
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('profile.firstName')" prop="firstName">
                  <el-input v-model="formData.firstName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('profile.lastName')" prop="lastName">
                  <el-input v-model="formData.lastName" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('profile.phone')" prop="phone">
                  <el-input 
                    v-model="phoneInput" 
                    @blur="formatPhone"
                    placeholder="+998"
                  />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item :label="$t('profile.passport')" prop="passport">
                  <el-input 
                    v-model="formData.passport" 
                    :placeholder="$t('profile.placeholders.passport')"
                    v-maska="'AA #######'"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="$t('profile.pinfl')" prop="pinfl">
              <el-input 
                v-model="formData.pinfl" 
                :placeholder="$t('profile.placeholders.pinfl')"
                maxlength="14" 
                show-word-limit
              />
            </el-form-item>

            <el-form-item :label="$t('profile.address')" prop="address">
              <el-input 
                v-model="formData.address" 
                type="textarea" 
                :rows="2" 
                :placeholder="$t('profile.placeholders.address')"
              />
            </el-form-item>

            <div class="edit-actions">
              <el-button @click="cancelEditing">{{ $t('profile.cancel') }}</el-button>
              <el-button type="primary" :loading="loading" @click="saveChanges">
                {{ $t('profile.saveChanges') }}
              </el-button>
            </div>
          </el-form>
        </div>
      </main>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Close, Edit, Camera, CopyDocument } from '@element-plus/icons-vue' // Iconlarni import qiling
// import { vMaska } from 'maska' // Agar maska o'rnatilgan bo'lsa

// Types
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  avatar?: string
  passport?: string
  pinfl?: string
  address?: string
  createdAt: string
}

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'logout'): void
  (e: 'save', userData: User): void
}>()

const { logout } = useAuth()
const { t } = useI18n()
const isEditing = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<Partial<User>>({})
const localUser = ref<User | null>(null)
const phoneInput = ref('')

// --- Watchers & Logic (Avvalgi kod bilan bir xil mantiq) ---
watch(() => props.user, (newVal) => {
  if (newVal) localUser.value = { ...newVal }
}, { immediate: true })

watch(isEditing, (editing) => {
  if (editing && localUser.value?.phone) {
    phoneInput.value = localUser.value.phone
  }
})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formatPhone = () => {
  let phone = phoneInput.value.replace(/\D/g, '')
  if (phone.startsWith('998')) phone = phone.substring(3)
  phone = phone.slice(0, 9)
  if (phone.length > 0) {
    let formatted = '+998'
    if (phone.length > 0) formatted += ' ' + phone.slice(0, 2)
    if (phone.length > 2) formatted += ' ' + phone.slice(2, 5)
    if (phone.length > 5) formatted += ' ' + phone.slice(5, 7)
    if (phone.length > 7) formatted += ' ' + phone.slice(7, 9)
    phoneInput.value = formatted
    formData.phone = formatted
  }
}

const startEditing = () => {
  if (localUser.value) {
    Object.assign(formData, localUser.value)
    phoneInput.value = localUser.value.phone || ''
    isEditing.value = true
  }
}

const cancelEditing = () => {
  isEditing.value = false
  if (formRef.value) formRef.value.clearValidate()
}

const resetForm = () => {
  isEditing.value = false
  loading.value = false
}

const rules = reactive<FormRules>({
  firstName: [{ required: true, message: t('profile.validation.firstNameRequired'), trigger: 'blur' }],
  lastName: [{ required: true, message: t('profile.validation.lastNameRequired'), trigger: 'blur' }],
  passport: [
    { required: true, message: t('profile.validation.passportRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) return callback()
        const normalized = String(value).toUpperCase().replace(/\s/g, '')
        const isValid = /^[A-Z]{2}\d{7}$/.test(normalized)
        if (!isValid) return callback(new Error(t('profile.validation.passportFormat')))
        callback()
      },
      trigger: 'blur'
    }
  ],
  pinfl: [{ min: 14, max: 14, message: t('profile.validation.pinflLength'), trigger: 'blur' }]
})

const saveChanges = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      formatPhone()
      try {
        emit('save', { ...localUser.value, ...formData } as User)
        localUser.value = { ...localUser.value, ...formData } as User
        ElMessage.success(t('profile.messages.saved'))
        isEditing.value = false
      } catch (e) {
        ElMessage.error(t('profile.messages.error'))
      } finally {
        loading.value = false
      }
    }
  })
}

const copyValue = async (type: 'passport' | 'pinfl', value?: string) => {
  if (!value) return
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = value
      textArea.setAttribute('readonly', '')
      textArea.style.position = 'absolute'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    ElMessage.success(
      type === 'passport' ? t('profile.messages.copiedPassport') : t('profile.messages.copiedPinfl')
    )
  } catch (e) {
    ElMessage.error(t('profile.messages.copyError'))
  }
}

// Helpers
const userInitials = computed(() => {
  if (!localUser.value?.firstName) return '?'
  return (localUser.value.firstName[0] + (localUser.value.lastName?.[0] || '')).toUpperCase()
})

const roleTagType = computed(() => {
  const map: Record<string, string> = { admin: 'danger', instructor: 'warning', student: 'success' }
  return map[localUser.value?.role || ''] || 'info'
})

const formatRole = (r: string) => r?.toUpperCase()
const formatDateShort = (d: string) => d ? new Date(d).toLocaleDateString('uz-UZ') : ''
const handleLogout = () => { dialogVisible.value = false; logout(); emit('logout') }
</script>

<style scoped lang="scss">
/* Asosiy Dialog Reset */
:deep(.modern-profile-dialog) {
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
  
  .el-dialog__header {
    display: none; /* Standart headerni o'chiramiz */
  }
  .el-dialog__body {
    padding: 0;
  }
}

.custom-dialog-header {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 30px);
  pointer-events: none; /* Clicklar pastga o'tishi uchun */
  
  span {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1f2937;
    pointer-events: auto;
  }
  
  .el-button {
    pointer-events: auto;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    &:hover { background: #fff; }
  }
}

.profile-container {
  display: block;
  min-height: 500px;
  background: #fff;
}

.avatar-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #fff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0;
  z-index: 1;
  position: relative;
  
  img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-initials { font-size: 2.5rem; font-weight: 800; color: #4f46e5; }
}

.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.role-badge {
  padding: 4px 12px;
  border: 2px solid #fff;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
}

.user-fullname {
  margin: 10px 0 5px;
  font-size: 1.4rem;
  line-height: 1.2;
  color: #1e293b;
}

.user-email {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 20px;
  word-break: break-all;
}

/* --- RIGHT MAIN CONTENT --- */
.profile-main {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  max-height: 600px;
}

.profile-main.full-width {
  width: 100%;
}

.profile-summary {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 20px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  margin-bottom: 30px;
}

.summary-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #475569;
}

.joined-text {
  font-weight: 500;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
  }
}

/* View Mode Styling */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 8px 4px 24px;
}

.info-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  align-items: start;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row label {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-row p {
  margin: 0;
  font-size: 1.12rem;
  color: #334155;
  font-weight: 500;
}

.divider-text {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
}


.mono-font {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #334155;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.doc-value-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.copy-btn {
  color: #64748b;
  font-size: 1rem;
  padding: 2px;
}

/* Edit Mode Styling */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
}
</style>
