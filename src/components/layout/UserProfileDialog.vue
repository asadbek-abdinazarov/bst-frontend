<template>
  <el-dialog
    v-model="dialogVisible"
    width="700px"
    class="profile-dialog"
    :show-close="false"
    align-center
    destroy-on-close
    @close="resetForm"
  >
    <template #header="{ titleId, titleClass }">
      <div class="dialog-header">
        <span :id="titleId" :class="titleClass">
          {{ $t('profile.myProfile') }}
        </span>
        <el-button circle text @click="dialogVisible = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </template>

    <div class="profile-content" v-if="localUser">
      <!-- User Header -->
      <div class="user-header">
        <div class="avatar">
          <img v-if="localUser.avatar" :src="localUser.avatar" alt="Avatar" />
          <span v-else class="avatar-initials">{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <h2>{{ localUser.firstName }} {{ localUser.lastName }}</h2>
          <p class="email">{{ localUser.email }}</p>
          <el-tag :type="roleTagType" effect="plain" size="small">
            {{ formatRole(localUser.role) }}
          </el-tag>
        </div>
        <div class="header-actions">
          <el-button type="danger" plain @click="handleLogout">
            {{ $t('profile.logout') }}
          </el-button>
        </div>
      </div>

      <!-- Tabs -->
      <el-tabs v-model="activeTab" class="profile-tabs">
        <!-- Profile Information Tab -->
        <el-tab-pane :label="$t('profile.profileInfo')" name="info">
          <div v-if="!isEditing" class="info-view">
            <div class="info-grid">
              <div class="info-item">
                <label>{{ $t('profile.firstName') }}</label>
                <p>{{ localUser.firstName || $t('profile.emptyValue') }}</p>
              </div>
              <div class="info-item">
                <label>{{ $t('profile.lastName') }}</label>
                <p>{{ localUser.lastName || $t('profile.emptyValue') }}</p>
              </div>
              <div class="info-item">
                <label>{{ $t('profile.phone') }}</label>
                <p>{{ localUser.phone || $t('profile.emptyValue') }}</p>
              </div>
              <div class="info-item">
                <label>{{ $t('profile.address') }}</label>
                <p>{{ localUser.address || $t('profile.noAddress') }}</p>
              </div>
              <div class="info-item">
                <label>{{ $t('profile.passport') }}</label>
                <div class="doc-value">
                  <span class="mono">{{ localUser.passport || $t('profile.emptyValue') }}</span>
                  <el-button
                    v-if="localUser.passport"
                    text
                    size="small"
                    @click="copyValue('passport', localUser.passport)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="info-item">
                <label>{{ $t('profile.pinfl') }}</label>
                <div class="doc-value">
                  <span class="mono">{{ localUser.pinfl || $t('profile.emptyValue') }}</span>
                  <el-button
                    v-if="localUser.pinfl"
                    text
                    size="small"
                    @click="copyValue('pinfl', localUser.pinfl)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            <div class="action-bar">
              <el-button type="primary" @click="startEditing">
                <el-icon class="el-icon--left"><Edit /></el-icon>
                {{ $t('profile.editProfile') }}
              </el-button>
            </div>
          </div>

          <div v-else class="info-edit">
            <el-form
              ref="formRef"
              :model="formData"
              :rules="rules"
              label-position="top"
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
        </el-tab-pane>

        <!-- Change Password Tab -->
        <el-tab-pane :label="$t('profile.changePassword')" name="password">
          <div class="password-form">
            <el-form
              ref="passwordFormRef"
              :model="passwordData"
              :rules="passwordRules"
              label-position="top"
            >
              <el-form-item :label="$t('profile.currentPassword')" prop="currentPassword">
                <el-input 
                  v-model="passwordData.currentPassword" 
                  type="password"
                  show-password
                  :placeholder="$t('profile.placeholders.currentPassword')"
                />
              </el-form-item>

              <el-form-item :label="$t('profile.newPassword')" prop="newPassword">
                <el-input 
                  v-model="passwordData.newPassword" 
                  type="password"
                  show-password
                  :placeholder="$t('profile.placeholders.newPassword')"
                />
              </el-form-item>

              <el-form-item :label="$t('profile.confirmPassword')" prop="confirmPassword">
                <el-input 
                  v-model="passwordData.confirmPassword" 
                  type="password"
                  show-password
                  :placeholder="$t('profile.placeholders.confirmPassword')"
                />
              </el-form-item>

              <div class="password-actions">
                <el-button @click="resetPasswordForm">{{ $t('profile.cancel') }}</el-button>
                <el-button type="primary" :loading="passwordLoading" @click="changePassword">
                  {{ $t('profile.updatePassword') }}
                </el-button>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Close, Edit, CopyDocument } from '@element-plus/icons-vue'
import { api } from '@/utils/api'

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

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
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
const passwordLoading = ref(false)
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const formData = reactive<Partial<User>>({})
const localUser = ref<User | null>(null)
const phoneInput = ref('')
const activeTab = ref('info')

// Password form data
const passwordData = reactive<PasswordData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Watchers
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
  activeTab.value = 'info'
  resetPasswordForm()
}

const resetPasswordForm = () => {
  passwordData.currentPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
  if (passwordFormRef.value) passwordFormRef.value.clearValidate()
}

// Validation rules
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

const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: t('profile.validation.currentPasswordRequired'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('profile.validation.newPasswordRequired'), trigger: 'blur' },
    { min: 6, message: t('profile.validation.passwordMin'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('profile.validation.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordData.newPassword) {
          callback(new Error(t('profile.validation.passwordsMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
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

const changePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      passwordLoading.value = true
      try {
        // API call to change password
        await api.put('/users/change-password', {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
        ElMessage.success(t('profile.messages.passwordChanged'))
        resetPasswordForm()
      } catch (e: any) {
        const errorMessage = e.response?.data?.message || t('profile.messages.passwordChangeError')
        ElMessage.error(errorMessage)
      } finally {
        passwordLoading.value = false
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
const handleLogout = () => { dialogVisible.value = false; logout(); emit('logout') }
</script>

<style scoped lang="scss">
.profile-dialog {
  :deep(.el-dialog__header) {
    padding: 0;
    margin: 0;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  
  span {
    font-weight: 600;
    font-size: 1.25rem;
    color: #1f2937;
  }
}

.profile-content {
  padding: 0;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-initials {
      font-size: 2rem;
      font-weight: 700;
      color: #4f46e5;
    }
  }
  
  .user-info {
    flex: 1;
    
    h2 {
      margin: 0 0 4px;
      font-size: 1.5rem;
      color: #1f2937;
      font-weight: 600;
    }
    
    .email {
      margin: 0 0 8px;
      color: #6b7280;
      font-size: 0.95rem;
    }
  }
  
  .header-actions {
    flex-shrink: 0;
  }
}

.profile-tabs {
  padding: 0 24px 24px;
  
  :deep(.el-tabs__header) {
    margin: 0 0 24px;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }
}

.info-view {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
  }
  
  .info-item {
    label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    p {
      margin: 0;
      font-size: 1rem;
      color: #1f2937;
      font-weight: 500;
    }
    
    .doc-value {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .mono {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #1f2937;
        font-size: 1rem;
      }
    }
  }
  
  .action-bar {
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
  }
}

.info-edit {
  .edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }
}

.password-form {
  max-width: 500px;
  
  .password-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}
</style>
