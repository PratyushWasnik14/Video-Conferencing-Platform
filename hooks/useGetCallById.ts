'use client'
import { useEffect, useState } from 'react'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

/**
 * Custom hook to fetch a call by its ID from the Stream Video API.
 *
 * @param {string | string[]} id - The ID of the call to fetch.
 * @returns {Object} - An object containing the call and a loading state.
 */
export const useGetCallById = (id: string | string[]) => {
  // State to store the fetched call data
  const [call, setCall] = useState<Call>()

  // State to track whether the call is still loading
  const [isCallLoading, setIsCallLoading] = useState(true)

  // Get the Stream Video client instance using the provided hook
  const client = useStreamVideoClient()

  // Effect hook to fetch the call when the client is available and the ID changes
  useEffect(() => {
    // If the client is not yet initialized, do nothing
    if (!client) return

    // Async function to fetch the call details
    const loadCall = async () => {
      try {
        // Query Stream Video API for the call with the given ID
        const { calls } = await client.queryCalls({ filter_conditions: { id } })

        // If a call is found, update the state
        if (calls.length > 0) setCall(calls[0])
      } catch (error) {
        console.error('Error fetching call:', error)
      } finally {
        // Set loading state to false once fetching is complete
        setIsCallLoading(false)
      }
    }

    // Invoke the async function
    loadCall()
  }, [client, id]) // Re-run the effect when the client or call ID changes

  // Return the call data and loading state for use in components
  return { call, isCallLoading }
}
