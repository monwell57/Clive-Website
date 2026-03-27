// File: proxy.ts (or src/proxy.ts)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes - ONLY Clerk's auth callbacks and static files
// These are required for the invitation flow to work
const isPublicRoute = createRouteMatcher([
	// Clerk authentication callbacks (CRITICAL for invites)
	'/api/clerk/(.*)',
	// Allow the sign-in route (will be invitation-only due to Restricted mode)
	'/sign-in(.*)',
	// Allow the sign-up route (invitation-only in Restricted mode)
	'/sign-up(.*)',
	// Allow webhook endpoints if you have them
	'/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
	// Protect EVERY route that is not in the public list
	if (!isPublicRoute(req)) {
		// This will redirect unauthenticated users to Clerk's sign-in
		// In Restricted mode, only invited users can access sign-up
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Match all request paths except for Next.js internals and static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
