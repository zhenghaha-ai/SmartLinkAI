import { ref } from 'vue'

export function useTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('theme')
  const isDark = ref(saved ? saved === 'dark' : prefersDark)

  function apply() {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  apply()

  function toggle() {
    isDark.value = !isDark.value
    apply()
  }

  return { isDark, toggle }
}
