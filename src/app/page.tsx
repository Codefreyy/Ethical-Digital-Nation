"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function Home() {
  const createFile = useMutation(api.files.createFile)
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Button
        onClick={() => {
          createFile({ name: "test" })
        }}
      >
        Click me
      </Button>
    </main>
  )
}
