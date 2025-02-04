'use client'
import { tokenProvider } from '@/actions/stream.actions'
import { useUser } from '@clerk/nextjs'
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY // Correctly access the env variable

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null) // Updated type
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user) return

    if (!apiKey) {
      throw new Error('API key is not set')
    }

    // Initialize the StreamVideoClient
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl || '', // Provide a default if imageUrl is undefined
      },
      tokenProvider,
    })

    // Set the client after initialization
    setVideoClient(client)
  }, [user, isLoaded])

  if (!videoClient) {
    return <div className='flex-center h-screen w-full'>
      <Image src='/icons/loading-circle.svg' alt='loading' width={50} height={50} />
      
    </div> // Or handle loading state for the client
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>
}

export default StreamVideoProvider
