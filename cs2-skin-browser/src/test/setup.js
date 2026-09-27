import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  // The API tests run in a Node environment, which has no browser localStorage
  if (typeof window !== 'undefined') window.localStorage.clear()
})
