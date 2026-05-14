import { useThemeStore } from '@/stores/theme.store'
import { storeToRefs } from 'pinia'

export function useTheme() {
  const themeStore = useThemeStore()
  const { isDark } = storeToRefs(themeStore)
  return { isDark, toggleTheme: themeStore.toggleTheme }
}
