"use client"

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { api } from "../../convex/_generated/api"
import { useQuery } from "convex/react"

export const Navbar = () => {
  // const { isSignedIn } = useAuth()
  let shownName = null
  const user = useUser()
  try {
    const currentUser = useQuery(api.users.getCurrentUser)
    if (currentUser?.username) {
      shownName = currentUser.username
    } else {
      shownName = user.user?.fullName ? user.user.fullName : ""
    }
  } catch (error) {
    console.log("error", error)
  }

  return (
    <header className="border-b sticky top-0 left-0 right-0 bg-white">
      <div className="container mx-auto flex justify-between items-center my-3">
        <Link href="/" className="">
          Ethical Digital Nation
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/events" className="hover:underline">
            Events
          </Link>
          {/* <Link href="/files" className="hover:underline">
            Files
          </Link> */}
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            {/* <Link className="hover:underline" href="/profile">
              {shownName}
            </Link> */}
            <Link href="/personal-center">Personal Center</Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
