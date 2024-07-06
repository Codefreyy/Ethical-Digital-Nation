"use client"

import { useQuery } from "convex/react"
import { FileCard } from "@/components/FileCard"
import { FileUploader } from "@/components/FileUploader"
import { api } from "../../../convex/_generated/api"

export default function Files() {
  const files = useQuery(api.files.getFiles)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-2xl font-semibold">Files</h4>
        <FileUploader />
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-3">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />
        })}
      </div>
    </>
  )
}
