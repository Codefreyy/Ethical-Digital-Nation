"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { CalendarClock, MapPin } from "lucide-react"

import { useRouter } from "next/navigation"

export default function EventItem({
  name,
  description,
  date,
  location,
  _id,
  creator,
}: {
  name: string
  description: string
  date?: string
  location?: string
  _id: string
  creator?: string
}) {
  const router = useRouter()
  console.log(date, location, creator)
  return (
    <Card
      className="group hover:shadow-md cursor-pointer"
      onClick={() => {
        router.push(`/events/${_id}`)
      }}
    >
      <CardHeader className="relative">
        <CardTitle className="sm:text-xl text-lg ">{name}</CardTitle>
        <div className="absolute top-2 right-2">
          {/* <FileCardActions file={file} /> */}
        </div>
        <CardDescription>
          <div>
            {location && (
              <div className=" text-gray-600 flex gap-2 items-center">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
            )}
            {date && (
              <div className="text-gray-600 flex gap-2 items-center">
                <CalendarClock className="w-4 h-4" />
                {formatDate(date)}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
