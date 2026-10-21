'use client'

import { Component, type ReactNode } from 'react'
import { switchToStatic } from '@/lib/device/mode'

interface Props {
  children: ReactNode
}

/** Fängt Ladefehler des Modells (useGLTF wirft beim Resume) und schaltet auf den statischen Modus. */
export class SceneErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    switchToStatic()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
