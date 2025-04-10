// Clerk configuration

export const clerkConfig = {
  // Set the path for the sign-in page
  signInUrl: "/auth/signin",

  // Set the path for the sign-up page (empty to disable sign-up)
  signUpUrl: "",

  // Set the path for the SSO callback
  afterSignInUrl: "/auth/signin/sso-callback",

  // Set the path for the sign-out callback
  afterSignOutUrl: "/",

  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/blog",
    "/blog/(.*)",
    "/auth/signin",
    "/auth/signin/(.*)",
    "/auth/unauthorized",
    "/minyanim",
    "/minyanim/(.*)",
    "/services",
    "/api/auth/(.*)",
  ],
};
