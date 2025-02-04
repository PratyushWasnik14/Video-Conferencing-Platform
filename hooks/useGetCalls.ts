/**
 * Custom React hook to fetch and categorize video calls using Stream Video SDK.
 *
 * This hook retrieves all calls associated with the current user,
 * categorizes them into ended and upcoming calls, and provides loading state management.
 * It utilizes Clerk authentication to get the user details and Stream Video SDK
 * to query calls based on filtering conditions.
 */

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

export const useGetCalls = () => {
  const { user } = useUser() // Fetch the authenticated user details
  const client = useStreamVideoClient() // Get Stream Video client instance
  const [calls, setCalls] = useState<Call[]>() // State to store retrieved calls
  const [isLoading, setIsLoading] = useState(false) // State to track loading status

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return // Ensure client and user ID exist before proceeding

      setIsLoading(true) // Set loading state to true before fetching data

      try {
        // Query calls sorted by start time in descending order
        // Filtering conditions: calls must have a start time and should be created by or include the user
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        })

        setCalls(calls) // Store retrieved calls in state
      } catch (error) {
        console.error(error) // Handle errors gracefully
      } finally {
        setIsLoading(false) // Reset loading state after operation
      }
    }

    loadCalls()
  }, [client, user?.id]) // Re-run effect when client or user ID changes

  const now = new Date()

  // Filter ended calls: Calls that have started in the past or have an explicit end time
  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt
  })

  // Filter upcoming calls: Calls that are scheduled for the future
  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now
  })

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading }
}
