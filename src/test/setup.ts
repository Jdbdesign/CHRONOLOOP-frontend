import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom doesn't implement the Pointer Events capture API. Radix UI primitives
// (e.g. Toast's swipe-to-dismiss gesture) call these on pointer interactions,
// so clicking anything inside them throws "hasPointerCapture is not a
// function" without this polyfill.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}

// vitest.config.ts sets `globals: false`, so @testing-library/react's built-in
// auto-cleanup (which only self-registers when it finds a global `afterEach`)
// never activates. Register it explicitly so DOM state doesn't leak between
// `it` blocks that each call render() within the same test file.
afterEach(() => {
  cleanup()
})
