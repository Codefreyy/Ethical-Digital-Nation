import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"

export const Header = () => {
  return (
    <header className="border-b py-2 px-3">
      <div className="container mx-auto flex justify-between items-center">
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
      </div>
    </header>
  )
}
