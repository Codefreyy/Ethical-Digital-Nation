"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { FileUploader } from "@/components/FileUploader"

export default function Home() {
  const files = useQuery(api.files.getFiles)
  return (
    <main className="container mx-auto">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-semibold">Your Files</h4>
        <FileUploader />
      </div>
      {files?.map((file) => {
        return <div key={file._id}>{file.title}</div>
      })}
    </main>
  )
}
