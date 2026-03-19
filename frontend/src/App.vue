<script setup>
import { ref } from 'vue'
import { useTheme } from './composables/useTheme.js'
import ProductForm from './components/ProductForm.vue'

const { isDark, toggle } = useTheme()

const status = ref('idle') // idle | loading | error
const errorMsg = ref('')

async function handleSubmit(formData) {
  status.value = 'loading'
  errorMsg.value = ''

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SDS_${formData.productName.replace(/\s+/g, '_')}.docx`
    a.click()
    URL.revokeObjectURL(url)
    status.value = 'idle'
  } catch (err) {
    errorMsg.value = err.message
    status.value = 'error'
  }
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-linear-bg)] transition-colors duration-300">

    <!-- Header -->
    <header class="border-b border-[var(--color-linear-border)] bg-[var(--color-linear-surface)]/80 backdrop-blur-md sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style="background: linear-gradient(135deg, #A78BFA, #F472B6);">S</div>
          <div>
            <div class="font-semibold text-[var(--color-linear-text)] text-sm">SmartLinkAI</div>
            <div class="text-xs text-[var(--color-linear-text-secondary)]">SDS Generator</div>
          </div>
        </div>
        <button
          @click="toggle"
          class="w-9 h-9 rounded-lg border border-[var(--color-linear-border)] flex items-center justify-center text-[var(--color-linear-text-secondary)] hover:text-[var(--color-linear-text)] transition-colors"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-3xl mx-auto px-6 py-10 fade-in-up">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-[var(--color-linear-text)] mb-2">SDS Document Generator</h1>
        <p class="text-[var(--color-linear-text-secondary)] text-sm">
          Enter your product information below. AI will generate a complete Safety Data Sheet compliant with OSHA 29 CFR 1910.1200.
        </p>
      </div>

      <!-- Card -->
      <div class="bg-[var(--color-linear-surface)] rounded-2xl border border-[var(--color-linear-border)] p-6 md:p-8">
        <ProductForm @submit="handleSubmit" :loading="status === 'loading'" />
      </div>

      <!-- Loading overlay -->
      <div v-if="status === 'loading'" class="mt-6 flex items-center gap-3 text-[var(--color-linear-text-secondary)] text-sm">
        <svg class="animate-spin w-4 h-4 text-[var(--color-linear-accent)]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Generating SDS with AI — this may take 15–30 seconds...
      </div>

      <!-- Error -->
      <div v-if="status === 'error'" class="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        <strong>Error:</strong> {{ errorMsg }}
      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-3xl mx-auto px-6 py-6 text-center text-xs text-[var(--color-linear-text-secondary)]">
      Powered by Claude AI · OSHA 29 CFR 1910.1200 compliant output
    </footer>
  </div>
</template>
