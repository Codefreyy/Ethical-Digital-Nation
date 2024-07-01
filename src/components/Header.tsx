import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center my-3">
        <Link href="/" className="">
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
