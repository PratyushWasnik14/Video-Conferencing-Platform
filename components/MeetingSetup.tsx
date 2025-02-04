'use client'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { use, useEffect } from 'react'
import { useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({setIsSetupComplete}: {setIsSetupComplete:(value:boolean)=> void}) => {
  const [isMicCamToggleon, setIsMicCamToggleon] = useState(false);
  const call = useCall()
  if (!call) {
    throw new Error('use call must be used within stream call component')
  }
  useEffect(() => {
    if(isMicCamToggleon){
      call?.camera?.disable()
      call?.microphone?.disable()  
    }else{
      call?.camera?.enable()
      call?.microphone?.enable() 
    }
  }, [isMicCamToggleon, call?.camera, call?.microphone])


  return (
    <div className='flex h-screen w-full flex-col items-center  justify-center gap-3 text-white'>
        <h1 className='text-2xl font-bold'>
            Setup
        </h1>
        <VideoPreview/>
        <div className='flex h-16 items-center justify-center gap-3'>
          <label className='flex items-center justify-center gap-2 font-medium'>
            <input type="checkbox" checked={isMicCamToggleon} onChange={(e) => setIsMicCamToggleon(e.target.checked)}  />
            Join with microphone and camera off
          </label>
          <DeviceSettings/>
        </div>
        <Button className='rounded-md bg-green-600 px-4 py-2.5 ' onClick={() => {
          call?.join();
          setIsSetupComplete(true);
        }}> Join Meeting

        </Button>
    </div>
  )
}

export default MeetingSetup