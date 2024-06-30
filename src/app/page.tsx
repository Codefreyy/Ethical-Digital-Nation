import { Button } from "@/components/ui/button"
import { currentUser } from "@clerk/nextjs/server"

export default async function Home() {
  const user = await currentUser()
  return (
    <main className="flex min-h-screen flex-col justify-between">
      hello {user?.fullName || "guest"}!<Button>Hello</Button>
    </main>
  )
}
