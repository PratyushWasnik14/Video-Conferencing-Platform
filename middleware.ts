import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

//createroutematcher helps to make specific routes public or private since we want the user to be logged in to access the dashboard


const protectedRoute = createRouteMatcher([
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/recordings',
  '/personal-room',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  //make sure the user is logged in if he is on protected routes basically check is the user has access

  if (protectedRoute(req) && !userId) {
    return redirectToSignIn()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
