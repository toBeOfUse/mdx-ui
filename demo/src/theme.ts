type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'mdx-demo-theme'

function getThemePreference(): ThemePreference {
  return (localStorage.getItem(STORAGE_KEY) as ThemePreference | null) ?? 'system'
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

function isDarkMode(pref: ThemePreference): boolean {
  if (pref === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
  return pref === 'dark'
}


type Listener = () => void
const listeners = new Set<Listener>()
function notify() { listeners.forEach(l => l()) }

export function subscribeToTheme(listener: Listener) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** Call once before createRoot to apply the saved theme without waiting on
 * React to go through the rendering process. */
export function initTheme() {
  applyTheme(isDarkMode(getThemePreference()))

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePreference() === 'system') {
      applyTheme(isDarkMode('system'))
      notify()
    }
  })
}

export function isDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

export function toggleTheme() {
  const shouldBeDarkNow = !isDark()
  localStorage.setItem(STORAGE_KEY, shouldBeDarkNow ? 'dark' : 'light')
  applyTheme(shouldBeDarkNow)
  notify()
}

import { useSyncExternalStore } from 'react'

export function useTheme() {
  const dark = useSyncExternalStore(subscribeToTheme, isDark)
  return { isDark: dark, toggle: toggleTheme }
}
