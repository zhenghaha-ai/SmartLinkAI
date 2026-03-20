<script setup>
import { ref } from 'vue'
import { useTheme } from './composables/useTheme.js'
import { generateSDS } from './services/gemini.js'
import { generatePDF } from './utils/pdfGenerator.js'
import { generateWord } from './utils/wordGenerator.js'
import ProductForm from './components/ProductForm.vue'
import BatchUpload from './components/BatchUpload.vue'

const { isDark, toggleTheme } = useTheme()

const activeTab = ref('single')
const format = ref('both')   // 'pdf' | 'word' | 'both'
const loading = ref(false)
const error = ref('')
const successName = ref('')

const FORMAT_OPTIONS = [
  { key: 'pdf',  label: 'PDF' },
  { key: 'word', label: 'Word' },
  { key: 'both', label: '两种' },
]

async function handleSubmit(formData) {
  loading.value = true
  error.value = ''
  successName.value = ''

  try {
    const sds = await generateSDS(formData)
    if (format.value === 'pdf'  || format.value === 'both') await generatePDF(sds)
    if (format.value === 'word' || format.value === 'both') await generateWord(sds)
    successName.value = formData.productName
  } catch (e) {
    error.value = e.message || '生成失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :class="isDark ? 'bg-[#0F0F11]' : 'bg-[var(--color-linear-bg)]'"
  >
    <!-- Navbar -->
    <header
      class="sticky top-0 z-10 border-b backdrop-blur-md transition-colors duration-300"
      :class="isDark
        ? 'border-[#27272A] bg-[#0F0F11]/80'
        : 'border-[var(--color-linear-border)] bg-[var(--color-linear-bg)]/80'"
    >
      <div class="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-[var(--color-linear-accent)] flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
            </svg>
          </div>
          <div>
            <span class="text-sm font-semibold" :class="isDark ? 'text-[#FAFAFA]' : 'text-[var(--color-linear-text)]'">
              SDS Generator
            </span>
            <span class="ml-1.5 text-xs px-1.5 py-0.5 rounded-md bg-[var(--color-linear-accent-subtle)] text-[var(--color-linear-accent)] font-medium">AI</span>
          </div>
        </div>

        <button
          @click="toggleTheme"
          class="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
          :class="isDark
            ? 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]'
            : 'text-[var(--color-linear-text-secondary)] hover:text-[var(--color-linear-text)] hover:bg-[var(--color-linear-bg-secondary)]'"
        >
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      <div class="mb-8 fade-in-up">
        <h1 class="text-2xl font-bold mb-2" :class="isDark ? 'text-[#FAFAFA]' : 'text-[var(--color-linear-text)]'">
          自动生成 SDS 安全数据表
        </h1>
        <p class="text-sm" :class="isDark ? 'text-[#A1A1AA]' : 'text-[var(--color-linear-text-secondary)]'">
          输入产品信息，AI 自动生成符合 OSHA 29 CFR 1910.1200 标准的完整 SDS PDF
        </p>
      </div>

      <!-- Tabs -->
      <div
        class="flex gap-1 p-1 rounded-xl mb-6 w-fit"
        :class="isDark ? 'bg-[#18181B]' : 'bg-[var(--color-linear-bg-secondary)]'"
      >
        <button
          v-for="tab in [{ key: 'single', label: '单品生成' }, { key: 'batch', label: 'Excel 批量' }]"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
          :class="activeTab === tab.key
            ? isDark ? 'bg-[#1C1C1F] text-[#FAFAFA] shadow-sm' : 'bg-white text-[var(--color-linear-text)] shadow-sm'
            : isDark ? 'text-[#71717A] hover:text-[#A1A1AA]' : 'text-[var(--color-linear-text-tertiary)] hover:text-[var(--color-linear-text-secondary)]'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Card -->
      <div
        class="rounded-2xl border p-6 sm:p-8 transition-colors duration-300 fade-in-up"
        :class="isDark ? 'bg-[#1C1C1F] border-[#27272A]' : 'bg-white border-[var(--color-linear-border)]'"
      >
        <!-- Format selector -->
        <div class="flex items-center gap-3 mb-6 pb-5 border-b"
             :class="isDark ? 'border-[#27272A]' : 'border-[var(--color-linear-border)]'">
          <span class="text-xs font-medium shrink-0"
                :class="isDark ? 'text-[#71717A]' : 'text-[var(--color-linear-text-tertiary)]'">
            输出格式
          </span>
          <div class="flex gap-1 p-1 rounded-lg"
               :class="isDark ? 'bg-[#18181B]' : 'bg-[var(--color-linear-bg-secondary)]'">
            <button
              v-for="opt in FORMAT_OPTIONS"
              :key="opt.key"
              @click="format = opt.key"
              class="px-3 py-1 text-xs font-medium rounded-md transition-all duration-200"
              :class="format === opt.key
                ? isDark
                  ? 'bg-[#27272A] text-[#FAFAFA] shadow-sm'
                  : 'bg-white text-[var(--color-linear-text)] shadow-sm'
                : isDark
                  ? 'text-[#71717A] hover:text-[#A1A1AA]'
                  : 'text-[var(--color-linear-text-tertiary)] hover:text-[var(--color-linear-text-secondary)]'"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Success -->
        <div v-if="successName && !loading"
          class="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 bg-[var(--color-linear-success-subtle)] border border-[var(--color-linear-success)]/20 fade-in-up">
          <svg class="w-5 h-5 flex-shrink-0 text-[var(--color-linear-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm text-[var(--color-linear-success)] font-medium">
            「{{ successName }}」SDS PDF 已生成并下载
          </p>
        </div>

        <!-- Error -->
        <div v-if="error"
          class="flex items-start gap-3 px-4 py-3 rounded-xl mb-6 bg-[var(--color-linear-danger-subtle)] border border-[var(--color-linear-danger)]/20 fade-in-up">
          <svg class="w-5 h-5 flex-shrink-0 text-[var(--color-linear-danger)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-[var(--color-linear-danger)]">生成失败</p>
            <p class="text-xs text-[var(--color-linear-danger)]/80 mt-0.5">{{ error }}</p>
          </div>
          <button @click="error = ''" class="text-[var(--color-linear-danger)]/60 hover:text-[var(--color-linear-danger)] transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <ProductForm v-if="activeTab === 'single'" :loading="loading" @submit="handleSubmit" />
        <BatchUpload v-else :format="format" />
      </div>

      <p class="mt-5 text-xs flex items-center gap-1.5"
         :class="isDark ? 'text-[#52525B]' : 'text-[var(--color-linear-text-tertiary)]'">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>
        生成的 SDS 基于 GHS 标准及提供的成分信息，使用前请由专业人员审核
      </p>
    </main>
  </div>
</template>
