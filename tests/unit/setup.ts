import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Ohne Vitest-Globals räumt Testing Library nicht selbst auf
afterEach(() => cleanup())
