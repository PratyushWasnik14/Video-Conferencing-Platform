'use client'

import Loader from '@/components/Loader'
import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { useGetCallById } from '@/hooks/useGetCallById'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useState } from 'react'
import { useParams } from 'next/navigation'


const Meeting = () => {
  // ✅ Get params using useParams (Client Component)
  const { id } = useParams<{ id: string }>()

  // ✅ Validate if ID exists
  if (!id) return <div>Invalid Meeting ID</div>

  // ✅ Get user data
  const { user, isLoaded } = useUser()

  // ✅ Track meeting setup state
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  // ✅ Fetch call details using custom hook
  const { call, isCallLoading } = useGetCallById(id)

  // ✅ Show loader if user or call data is not yet available
  if (!isLoaded || isCallLoading) return <Loader />

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
