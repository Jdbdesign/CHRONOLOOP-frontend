import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// vitest.config.ts sets `globals: false`, so @testing-library/react's built-in
// auto-cleanup (which only self-registers when it finds a global `afterEach`)
// never activates. Register it explicitly so DOM state doesn't leak between
// `it` blocks that each call render() within the same test file.
afterEach(() => {
  cleanup()
})
