import { useSyncExternalStore } from 'react'
import { isDark, toggleTheme, subscribeToTheme } from './theme'

export function useTheme() {
  const dark = useSyncExternalStore(subscribeToTheme, isDark)
  return { isDark: dark, toggle: toggleTheme }
}
