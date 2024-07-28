"use client"

import { EventCreator } from "@/components/EventCreator"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import EventItem from "@/components/EventItem"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
// Sort component
const Sort = ({ onSortChange }: { onSortChange: (value: string) => void }) => {
  return (
    <Select onValueChange={onSortChange}>
      <SelectTrigger>CreationTime(New to Old)</SelectTrigger>
      <SelectContent>
        <SelectItem value="createTimeDesc">
          Creation Time (New to Old)
        </SelectItem>
        <SelectItem value="createTimeAsc">
          Creation Time (Old to New)
        </SelectItem>
        <SelectItem value="startTimeDesc">Start Time (New to Old)</SelectItem>
        <SelectItem value="startTimeAsc">Start Time (Old to New)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default function Events() {
  const events = useQuery(api.events.getEvents)
  const [sortedEvents, setSortedEvents] = useState(events || [])
  const [sortOption, setSortOption] = useState("createTimeDesc")

  useEffect(() => {
    if (events) {
      let sorted = [...events]
      switch (sortOption) {
        case "createTimeDesc":
          sorted.sort((a, b) => b._creationTime - a._creationTime)
          break
        case "createTimeAsc":
          sorted.sort((a, b) => a._creationTime - b._creationTime)
          break
        case "startTimeDesc":
          sorted.sort((a, b) => {
            const dateA = new Date(a.date ?? 0).getTime()
            const dateB = new Date(b.date ?? 0).getTime()
            if (!dateA) return 1
            if (!dateB) return -1
            return dateB - dateA
          })
          break
        case "startTimeAsc":
          sorted.sort((a, b) => {
            const dateA = new Date(a.date ?? 0).getTime()
            const dateB = new Date(b.date ?? 0).getTime()
            if (!dateA) return 1
            if (!dateB) return -1
            return dateA - dateB
          })
          break
        default:
          break
      }
      setSortedEvents(sorted)
    }
  }, [events, sortOption])

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-2xl font-semibold">Events</h4>
        <EventCreator />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow"></div>
        <div className="flex-shrink-0">
          <Sort onSortChange={setSortOption} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3">
        {sortedEvents?.map((event) => <EventItem key={event._id} {...event} />)}
      </div>
    </>
  )
}
