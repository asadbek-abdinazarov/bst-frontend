<template>
  <div class="login-container">
    <div class="login-header-actions">
      <LanguageSwitcher />
    </div>
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Bekobod Shahar 1 - son Texnikumi</h1>
          <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              type="email"
              :placeholder="$t('login.email')"
              size="large"
              :prefix-icon="User"
              class="login-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('login.password')"
              size="large"
              :prefix-icon="Lock"
              show-password
              class="login-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <div class="login-options">
            <el-checkbox v-model="loginForm.rememberMe" class="remember-me">
              {{ $t('login.rememberMe') }}
            </el-checkbox>
            <a href="#" class="forgot-password">{{ $t('login.forgotPassword') }}</a>
          </div>

          <el-button
            type="primary"
            size="large"
            :loading="isLoading"
            class="login-button"
            @click="handleLogin"
          >
            {{ isLoading ? $t('login.signingIn') : $t('login.signIn') }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const { t } = useI18n()
const loginFormRef = ref<FormInstance>()
const { login, isLoading } = useAuth()

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const loginRules = computed<FormRules>(() => ({
  email: [
    { required: true, message: t('login.validation.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('login.validation.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('login.validation.passwordMin'), trigger: 'blur' },
  ],
}))

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await login({
          email: loginForm.email,
          password: loginForm.password,
          rememberMe: loginForm.rememberMe,
        })
        ElMessage.success(t('login.success'))
      } catch (error: any) {
        ElMessage.error(error?.message || t('login.error'))
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb; // neutral-50
  padding: 1rem;
  position: relative;
}

.login-header-actions {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
}

.login-wrapper {
  width: 100%;
  max-width: 480px;
  position: relative;

  @media (min-width: 768px) {
    max-width: 640px;
  }
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.75rem; // Mobile base
  font-weight: 700;
  color: #1f2933; // neutral-800
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;

  @media (min-width: 640px) {
    font-size: 2rem; // Tablet
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem; // Desktop
  }
}

.login-subtitle {
  color: #6b7280; // neutral-500
  font-size: 0.875rem; // Mobile base
  margin: 0;

  @media (min-width: 640px) {
    font-size: 1rem; // Tablet
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem; // Desktop
  }
}

.login-form {
  margin-top: 1.5rem;
}

.login-input {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    border-color: #e5e7eb; // neutral-200
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
      border-color: #d1d5db; // neutral-300
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    &.is-focus {
      border-color: #2563eb; // primary-600
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  :deep(.el-input__inner) {
    font-size: 0.9375rem; // Mobile base (15px)
  }

  :deep(.el-input__inner::placeholder) {
    color: #9ca3af; // neutral-400
    font-size: 0.9375rem; // Mobile base (15px)
  }

  @media (min-width: 1024px) {
    :deep(.el-input__inner) {
      font-size: 1rem; // Desktop (16px)
    }

    :deep(.el-input__inner::placeholder) {
      font-size: 1rem; // Desktop (16px)
    }
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem; // Mobile base (14px)

  @media (min-width: 1024px) {
    font-size: 1rem; // Desktop (16px)
  }
}

.remember-me {
  :deep(.el-checkbox__label) {
    color: #6b7280; // neutral-500
    font-size: 0.875rem; // Mobile base (14px)

    @media (min-width: 1024px) {
      font-size: 1rem; // Desktop (16px)
    }
  }
}

.forgot-password {
  color: #1d4ed8; // primary-700
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem; // Mobile base (14px)
  transition: color 0.2s ease;

  @media (min-width: 1024px) {
    font-size: 1rem; // Desktop (16px)
  }

  &:hover {
    color: #1e40af; // primary-800
    text-decoration: underline;
  }
}

.login-button {
  width: 100%;
  height: 48px; // Mobile base
  font-size: 1rem; // Mobile base (16px)
  font-weight: 600;
  border-radius: 8px;
  background: #2563eb; // primary-600
  border: none;
  transition: all 0.2s ease;

  @media (min-width: 1024px) {
    height: 52px; // Desktop
    font-size: 1.125rem; // Desktop (18px)
  }

  &:hover {
    background: #1d4ed8; // primary-700
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

:deep(.el-form-item) {
  margin-bottom: 1.25rem;
}

:deep(.el-form-item__error) {
  font-size: 0.8125rem; // Mobile base (13px)
  padding-top: 0.25rem;

  @media (min-width: 1024px) {
    font-size: 0.875rem; // Desktop (14px)
  }
}

@media (max-width: 640px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-header-actions {
    top: 1rem;
    right: 1rem;
  }
}
</style>
