"use client"

import { useQuery } from "convex/react"
import { v } from "convex/values"
import { api } from "../../../../convex/_generated/api"
import { formatDate } from "@/lib/utils"
import { CalendarClock, ChevronDownIcon, MapPin } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type EventPageProps = {
  params: {
    eventId: v.id<"events">
  }
}

type Event = {
  name: string
  date: string
  location: string
  description: string
}

export default function EventPage({ params: { eventId } }: EventPageProps) {
  const event = useQuery(api.events.getEvent, { id: eventId })

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">No event found.</div>
    )
  }

  const { name, date, location, description } = event as Event

  return (
    <div className="">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{name}</h1>
        <Button variant="secondary">Join</Button>
      </div>
      <div className="text-lg text-gray-600 mb-2 flex gap-2">
        <CalendarClock />
        {formatDate(date)}
      </div>
      <div className="text-lg text-gray-600 mb-4 flex gap-2">
        <MapPin />
        {location}
      </div>

      <div className="text-base text-gray-700">{description}</div>
    </div>
  )
}
