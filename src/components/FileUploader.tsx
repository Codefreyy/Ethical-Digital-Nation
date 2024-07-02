"use client"

import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "convex/react"
import toast, { Toaster } from "react-hot-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { api } from "../../convex/_generated/api"
import { useState } from "react"

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title is too long" }),
  description: z.optional(z.string().min(2).max(200)),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required a file")
    .refine((files) => files.length > 0, "Required a file"),
})

export const FileUploader = () => {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const fileRef = form.register("file")
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const uploadFile = useMutation(api.files.uploadFile)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const postUrl = await generateUploadUrl()
      const res = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": values.file[0].type,
        },
        body: values.file[0],
      })

      const { storageId } = await res.json()

      await uploadFile({
        title: values.title,
        file: storageId,
        description: values.description,
      })

      form.reset()
      setIsFileDialogOpen(false)
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
  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <Toaster />

      <DialogTrigger asChild>
        <Button onClick={() => setIsFileDialogOpen(true)}>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8 font-medium">
            Upload your file here
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your file" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select File</FormLabel>
                      <FormControl>
                        <Input
                          className="hover: cursor-pointer"
                          type="file"
                          {...fileRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
