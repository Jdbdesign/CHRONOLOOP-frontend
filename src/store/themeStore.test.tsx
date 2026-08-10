import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThemeStore, useThemeSync } from './themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'dark' })
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to dark theme', () => {
    const { result } = renderHook(() => useThemeStore((state) => state.theme))
    expect(result.current).toBe('dark')
  })

  it('updates theme state via setTheme', () => {
    const { result } = renderHook(() => useThemeStore((state) => state))
    act(() => result.current.setTheme('light'))
    expect(result.current.theme).toBe('light')
  })

  it('useThemeSync writes the current theme onto <html data-theme>', () => {
    renderHook(() => useThemeSync())
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    act(() => useThemeStore.getState().setTheme('light'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
