'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { de } from '@/content/de'
import type { SiteContent } from '@/content/types'

const ContentContext = createContext<SiteContent>(de)

export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent(): SiteContent {
  return useContext(ContentContext)
}
