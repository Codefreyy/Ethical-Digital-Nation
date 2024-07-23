"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { formatDate } from "@/lib/utils"
import { CalendarClock, MapPin } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "@/components/ui/use-toast"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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
  link: string
  isContactPublic: boolean
}

type EventDetail = {
  event: Event
  isCreator: boolean
  hasJoined: boolean
  creator: {
    username: string
    email: string | undefined
    bio: string
    organization: string
  }
}

export default function EventPage({ params: { eventId } }: EventPageProps) {
  const joinEvent = useMutation(api.events.joinEvent)
  const updateEvent = useMutation(api.events.updateEvent)
  const deleteEvent = useMutation(api.events.deleteEvent)
  const participants = useQuery(api.events.getEventParticipants, {
    eventId: eventId as Id<"events">,
  })
  const router = useRouter()

  const event = useQuery(api.events.getEventDetails, {
    eventId: eventId as Id<"events">,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatedEvent, setUpdatedEvent] = useState<Omit<Event, "creatorId">>({
    name: "",
    date: "",
    location: "",
    description: "",
    link: "",
    isContactPublic: false,
  })

  if (!event || !event.event) {
    return (
      <div className="text-center py-20 text-gray-500">No event found.</div>
    )
  }

  const {
    event: { name, date, location, description, link, isContactPublic },
    isCreator,
    hasJoined,
    creator,
  } = event as unknown as EventDetail

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

  const handleEditEvent = () => {
    setUpdatedEvent({
      name,
      date,
      location,
      description,
      link,
      isContactPublic,
    })
    setIsEditing(true)
  }

  const handleSaveEvent = async () => {
    try {
      await updateEvent({
        eventId: eventId as Id<"events">,
        ...updatedEvent,
      })
      toast({
        title: "Success",
        description: "Event updated successfully",
        duration: 2000,
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent({ eventId: eventId as Id<"events"> })
      toast({
        title: "Success",
        description: "Event deleted successfully",
        duration: 2000,
      })
      router.push("/events")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
        duration: 2000,
      })
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

        {isCreator && !isEditing && (
          <div className="flex justify-end items-center gap-2">
            <Button variant="secondary" onClick={handleEditEvent}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
              Delete
            </Button>
          </div>
        )}
        {isCreator && isEditing && (
          <div className="flex justify-end items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent}>Save</Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {isCreator && isEditing ? (
          <>
            <Label htmlFor="name">Event Name</Label>
            <Input
              value={updatedEvent.name}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, name: e.target.value })
              }
            />
            <Label htmlFor="date">Date</Label>
            <Input
              type="datetime-local"
              value={updatedEvent.date}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, date: e.target.value })
              }
            />
            <Label htmlFor="date">Location</Label>

            <Input
              value={updatedEvent.location}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, location: e.target.value })
              }
            />
            <Label htmlFor="date">Description</Label>

            <Textarea
              value={updatedEvent.description}
              onChange={(e) =>
                setUpdatedEvent({
                  ...updatedEvent,
                  description: e.target.value,
                })
              }
            />
            <Label htmlFor="date">Link</Label>
            <Input
              value={updatedEvent.link}
              onChange={(e) =>
                setUpdatedEvent({ ...updatedEvent, link: e.target.value })
              }
            />
            <div className="flex items-center">
              <Switch
                checked={updatedEvent.isContactPublic}
                onCheckedChange={(checked) =>
                  setUpdatedEvent({ ...updatedEvent, isContactPublic: checked })
                }
              />
              <label className="ml-2">Share your contact for this event?</label>
            </div>
          </>
        ) : (
          <>
            {creator && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="inline-block w-32 text-blue-500 underline underline-offset-2 cursor-pointer">
                    Event Creator: {creator.username || ""}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        @{creator.username}
                      </h4>
                      <p className="text-sm">
                        <strong>Email:</strong> {creator.email}
                      </p>
                      <p className="text-sm">
                        <strong>Bio:</strong> {creator.bio}
                      </p>
                      <p className="text-sm">
                        <strong>Organization:</strong> {creator.organization}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            {!creator && <p>Created by: Anonymous</p>}
            <div className="text-md text-gray-600 flex gap-2">
              <CalendarClock />
              {formatDate(date)}
            </div>
            <div className="text-md text-gray-600 flex gap-2">
              <MapPin />
              {location}
            </div>
            <div className="text-base">
              Link:{" "}
              <a
                href={link}
                target="_blank"
                className=" text-gray-700 underline underline-offset-2 hover:no-underline"
              >
                {" "}
                {link}
              </a>
            </div>
            <div className="text-base text-gray-700 ">{description}</div>
          </>
        )}
        {isCreator && participants && participants.participants && (
          <ul className="flex flex-col gap-3">
            {participants.participants.map((p) => (
              <li key={p?._id}>{p?.name}</li>
            ))}
          </ul>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
