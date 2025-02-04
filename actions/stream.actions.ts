'use server'

import { currentUser } from '@clerk/nextjs/server'
import { StreamClient } from '@stream-io/node-sdk'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
const apiSecret = process.env.STREAM_SECRET_KEY

export const tokenProvider = async () => {
  const user = await currentUser()
  if (!user) throw new Error('User not found')
  if (!apiKey) throw new Error('API key is not set')
  if (!apiSecret) throw new Error('API secret is not set')

  const client = new StreamClient(apiKey, apiSecret)

  // Set the expiration time (e.g., 1 hour from now)
  const expiration = Math.round(new Date().getTime() / 1000) + 60 * 60

  // Generate a user token (valid for 1 hour)
  const token = client.generateUserToken({
    user_id: user.id,
    expires_at: expiration, // Expiration time in seconds
  })

  return token
}
