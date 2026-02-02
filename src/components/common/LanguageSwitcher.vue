<template>
  <el-dropdown @command="handleLanguageChange" placement="bottom-end">
    <el-button :icon="Setting" circle class="language-switcher-btn" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :command="'uz-Latn'"
          :class="{ 'is-active': currentLocale === 'uz-Latn' }"
        >
          O'zbek (Lotin)
        </el-dropdown-item>
        <el-dropdown-item
          :command="'uz-Cyrl'"
          :class="{ 'is-active': currentLocale === 'uz-Cyrl' }"
        >
          O'zbek (Kiril)
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useLocaleStore } from '@/stores/locale'
import type { SupportedLocale } from '@/i18n'

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.currentLocale)

const handleLanguageChange = (locale: SupportedLocale) => {
  localeStore.setLocale(locale)
}
</script>

<style scoped lang="scss">
.language-switcher-btn {
  border: 1px solid #e5e7eb;
  background: white;
  color: #2563eb;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #2563eb;
  }
}

:deep(.el-dropdown-menu__item.is-active) {
  color: #2563eb;
  font-weight: 600;
  background-color: #eff6ff;
}
</style>
