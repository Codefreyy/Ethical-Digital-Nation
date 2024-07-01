"use client"

import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function Home() {
  const createFile = useMutation(api.files.createFile)
  const files = useQuery(api.files.getFiles)
  return (
    <main className="flex flex-col justify-between">
      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>
      })}
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
