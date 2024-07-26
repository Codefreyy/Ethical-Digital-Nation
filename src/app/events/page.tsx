"use client"

import { EventCreator } from "@/components/EventCreator"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import EventItem from "@/components/EventItem"

export default function Events() {
  const events = useQuery(api.events.getEvents)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-2xl font-semibold">Events</h4>
        <EventCreator />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3">
        {events?.map((event) => <EventItem key={event._id} {...event} />)}
      </div>
    </>
  )
}
