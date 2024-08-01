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
import { Menu, TreePalm } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar"

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
    <header className="border-b sticky top-0 left-0 right-0 bg-white py-3 z-40 dark:bg-black dark:text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TreePalm className="w-6 h-6" />
          <Link href="/" className="font-bold text-lg hidden sm:block">
            Ethical Digital Nation
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col sm:hidden">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="border-none">
                  {" "}
                  <Menu className="w-4 h-4" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/events" className="hover:underline">
                      Events
                    </Link>
                  </MenubarItem>
                  <SignedOut>
                    <MenubarItem>
                      {" "}
                      <SignInButton>
                        <Button>Sign In</Button>
                      </SignInButton>
                    </MenubarItem>
                  </SignedOut>
                  <SignedIn>
                    <MenubarItem>
                      {" "}
                      <Link className="hover:underline" href="/personal-center">
                        Personal Center
                      </Link>
                    </MenubarItem>
                  </SignedIn>

                  <MenubarItem>
                    {" "}
                    <div>
                      <DarkModeToggle />
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/events" className="hover:underline">
              Events
            </Link>
            <SignedOut>
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link className="hover:underline" href="/personal-center">
                Personal Center
              </Link>
              <UserButton />
            </SignedIn>

            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
