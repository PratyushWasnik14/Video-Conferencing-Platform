import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next'
import React from 'react'
import { Stream } from 'stream'

export const metadata: Metadata = {
  title: 'MOOZ',
  description: 'Video calling app',
  icons: {
    icon: '/icons/logo.svg',
  },
}

const rootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  )
} 

export default rootLayout
