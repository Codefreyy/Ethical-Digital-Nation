import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { Button } from "./ui/button"

export const Navbar = () => {
  return (
    <header className="flex justify-between border border-gray-100 py-5 px-3">
      <Link href="/" className="font-semibold">
        Ethical Digital Nation
      </Link>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}
