"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { FileUploader } from "@/components/FileUploader"
import { FileCard } from "@/components/FileCard"

export default function Home() {
  const files = useQuery(api.files.getFiles)
  return (
    <main className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-2xl font-semibold">Your Files</h4>
        <FileUploader />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />
        })}
      </div>
    </main>
  )
}
