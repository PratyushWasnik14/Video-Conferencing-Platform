'use client'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const EndCallButton = () => {
  const call = useCall()
  const router = useRouter()
  const { useLocalParticipant } = useCallStateHooks()
  const localParticipant = useLocalParticipant()
  // Check if the current participant is the owner of the meeting
  const isMeetingOwner =
    // Ensure localParticipant exists before accessing its properties
    localParticipant &&
    // Ensure the call object and its state.createdBy property exist
    call?.state.createdBy &&
    // Compare the current participant's userId with the meeting creator's ID
    localParticipant.userId === call.state.createdBy.id

    if(!isMeetingOwner) return null


  return (
    <Button onClick={async () => { await call.endCall(); router.push('/'); }} className='bg-red-500 hover:bg-red-600'>
            End Call for all
    </Button>
  )
}

export default EndCallButton

//Property	Object it Belongs To	Purpose
// localParticipant.userId	localParticipant	Gets the ID of the current participant.
// call?.state	call	Represents the current state of the call (optional chaining prevents errors if call is undefined).
// call.state.createdBy	call.state	Retrieves the user who created the meeting.
// call.state.createdBy.id	call.state.createdBy	Gets the ID of the meeting creator.