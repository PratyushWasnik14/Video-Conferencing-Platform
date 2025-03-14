'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import Homecard from './Homecard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { link } from 'fs'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from '@/components/ui/input'

const MeetingTypeList = () => {
  const router = useRouter()
  const [meetingState, setmeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >()
  const { user } = useUser()
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })
  const [callDetails, setCallDetails] = useState<Call>()

  const { toast } = useToast()

  const createMeeting = async () => {
    if (!client || !user) return
    try {
      if (!values.dateTime) {
        toast({
          title: 'please select a date and time',
        })
        return
      }
      const id = crypto.randomUUID()
      const call = client.call('default', id)
      if (!call) throw new Error('Call not found')
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || 'instant meeting'

      await call.getOrCreate({
        data: { starts_at: startsAt, custom: { description } },
      })
      setCallDetails(call)
      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({ title: 'Meeting created successfully' })
    } catch (error) {
      console.error('Error creating meeting:', error)
      toast({
        title: 'Failed to create meeting',
      })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Homecard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => {
          setmeetingState('isInstantMeeting')
        }}
        className="bg-gradient-to-b from-[#020024] via-[#0A0A87] to-[#00D4FF] hover:scale-105 hover:opacity-90 transition-all duration-300 ease-in-out rounded-[14px] cursor-pointer"
      />
      <Homecard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => {
          setmeetingState('isScheduleMeeting')
        }}
        className="bg-gradient-to-b from-[#6a0dad] via-[#8a2be2] to-[#d896ff] hover:scale-105 hover:opacity-90 transition-all duration-300 ease-in-out rounded-[14px] cursor-pointer"
      />
      <Homecard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => {
          router.push('/recordings')
        }}
        className="bg-gradient-to-b from-[#D00000] via-[#FF1E00] to-[#FFB3B3] hover:scale-105 hover:opacity-90 transition-all duration-300 ease-in-out rounded-[14px] cursor-pointer"
      />
      <Homecard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Join an existing meeting"
        handleClick={() => {
          setmeetingState('isJoiningMeeting')
        }}
        className="bg-gradient-to-b from-[#FF7F11] via-[#FF5500] to-[#FFAA33] hover:scale-105 hover:opacity-90 transition-all duration-300 ease-in-out rounded-[14px] cursor-pointer"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setmeetingState(undefined)}
          title="Creare a Meeting"
          className="text-center"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[24px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <label className="text-base text-normal leading-[24px] text-sky-2">
              Select date and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat={'dd/MM/yyyy HH:mm'}
              className="w-full rounded-[10px] border-none bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setmeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({
              title: 'Link Copied',
            })
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
