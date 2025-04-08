# Clerk Authentication Setup

This project uses Clerk for authentication. Follow these steps to set up Clerk:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com/) and sign up for an account
2. Create a new application in the Clerk dashboard

## 2. Configure Authentication Methods

1. In your Clerk dashboard, go to **User & Authentication** > **Authentication**
2. Enable the authentication methods you want to use:
   - Social connections (Google, GitHub, etc.)
   - Phone number
   - Username

## 3. Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**

## 4. Update Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual Clerk API keys:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key
```

## 5. Customize the Sign-In and Sign-Up Pages

You can customize the appearance of the Clerk components in:
- `/app/auth/signin/[[...sign-in]]/page.tsx`
- `/app/auth/signup/[[...sign-up]]/page.tsx`

## 6. Protect Routes

Routes are protected using the Clerk middleware. You can configure which routes are public by updating the `publicRoutes` array in the middleware.

## 7. Access User Data

You can access the current user's data in client components using the `useUser` hook:

```tsx
'use client';

import { useUser } from '@clerk/nextjs';

export default function MyComponent() {
  const { user, isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  if (!isSignedIn) return <div>Please sign in</div>;
  
  return <div>Hello, {user.firstName}!</div>;
}
```

For server components, you can use the `currentUser` function:

```tsx
import { currentUser } from '@clerk/nextjs/server';

export default async function MyServerComponent() {
  const user = await currentUser();
  
  if (!user) return <div>Please sign in</div>;
  
  return <div>Hello, {user.firstName}!</div>;
}
```
