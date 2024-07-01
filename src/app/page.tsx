"use client"

import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import toast, { Toaster } from "react-hot-toast"
import { FileUp } from "lucide-react"
import { FileUploader } from "@/components/FileUploader"

export default function Home() {
  const createFile = useMutation(api.files.createFile)
  const handleCreateFile = async () => {
    try {
      await createFile({ name: "test" })
    } catch (err) {
      const errorMessage = (err as Error).message
      if (errorMessage.includes("not authenticated")) {
        toast.error("You need to be authenticated to create a file", {
          duration: 3000,
          position: "bottom-right",
        })
      }
    }
  }

  const files = useQuery(api.files.getFiles)
  return (
    <main className="container mx-auto">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-semibold">Your Files</h4>
        <FileUploader />
      </div>
      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>
      })}
      <Toaster />
    </main>
  )
}
