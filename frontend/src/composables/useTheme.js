import { ref, onMounted, watchEffect } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  onMounted(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
