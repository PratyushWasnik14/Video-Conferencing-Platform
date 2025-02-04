'use client'
import MeetingTypeList from '@/components/MeetingTypeList'
import React, { useState, useEffect } from 'react'

const Home = () => {
  const [dateTime, setDateTime] = useState({
    date: '',
    time: '',
  })

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now),
      })
    }

    updateDateTime() // Set initial value
    const interval = setInterval(updateDateTime, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">
        <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
          <div className="flex flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
            
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-extrabold lg:text-7xl">
                {dateTime.time || 'Loading...'}
              </h1>
              <p className="text-lg font-medium text-sky-1 lg:text-2xl">
                {dateTime.date || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </h1>

      <MeetingTypeList />

    </section>
  )
}

export default Home
