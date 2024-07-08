"use client"

import { useMutation, useQuery } from "convex/react"
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

import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "@/components/ui/use-toast"
import { getEventParticipants } from "../../../../convex/events"

type EventPageProps = {
  params: {
    eventId: string
  }
}

type Event = {
  name: string
  date: string
  location: string
  description: string
  creatorId: Id<"users">
}

type EventDetail = {
  event: Event
  isCreator: boolean
  hasJoined: boolean
}

export default function EventPage({ params: { eventId } }: EventPageProps) {
  const joinEvent = useMutation(api.events.joinEvent)
  const participants = useQuery(api.events.getEventParticipants, {
    eventId: eventId as Id<"events">,
  })

  const event = useQuery(api.events.getEventDetails, {
    eventId: eventId as Id<"events">,
  })

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">No event found.</div>
    )
  }

  const {
    event: { name, date, location, description },
    isCreator,
    hasJoined,
  } = event as unknown as EventDetail

  console.log(participants, "participants")

  const handleJoinEvent = async () => {
    try {
      await joinEvent({ eventId: eventId as Id<"events"> })
      toast({
        title: "Success",
        description: "You have successfully joined the event",
        duration: 2000,
      })
    } catch (error: any) {
      const errorMessage = (error as Error).message
      if (errorMessage.includes("User not found")) {
        toast({
          title: "Error",
          description: "You haven't signed up yet. Please sign up first.",
          variant: "destructive",
          duration: 2000,
        })
      } else if (errorMessage.includes("User already joined event")) {
        toast({
          title: "Error",
          description: "You have already joined this event",
          variant: "destructive",
          duration: 2000,
        })
      } else if (errorMessage.includes("not authenticated")) {
        toast({
          title: "Error",
          description: "You need to be authenticated to join an event",
          variant: "destructive",
          duration: 2000,
        })
      }
    }
  }

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
        {!isCreator && !hasJoined && (
          <Button variant="secondary" onClick={handleJoinEvent}>
            Join
          </Button>
        )}
        {!isCreator && hasJoined && (
          <Button variant="secondary" disabled>
            Already Joined
          </Button>
        )}

        {isCreator && <Button variant="secondary">Edit</Button>}
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

      {isCreator && participants && participants.participants.length && (
        <ul className="flex flex-col gap-3">
          {participants.participants.map((p) => (
            <li>{p?.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
