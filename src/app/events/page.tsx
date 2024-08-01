"use client"

import { EventCreator } from "@/components/EventCreator"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import EventItem from "@/components/EventItem"
import { SetStateAction, useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type SortComponentType = {
  onSortChange: (value: string) => void
}

const sortTermDict: Record<string, string> = {
  createTimeDesc: "Creation Time (New to Old)",
  createTimeAsc: "Creation Time (Old to New)",
  startTimeDesc: "Start Time (New to Old)",
  startTimeAsc: "Start Time (Old to New)",
} as const

// Sort component
const Sort = ({ onSortChange }: SortComponentType) => {
  const handleSortChange = (value: string) => {
    onSortChange(value)
    setSortTerm(sortTermDict[value])
  }

  const [sortTerm, setSortTerm] = useState("Creation Time (New to Old)")

  return (
    <Select onValueChange={handleSortChange}>
      <SelectTrigger>{sortTerm}</SelectTrigger>
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
  const [searchTerm, setSearchTerm] = useState("")
  const [sortedEvents, setSortedEvents] = useState(events || [])
  const [sortOption, setSortOption] = useState("createTimeDesc")

  useEffect(() => {
    console.log("sortOption", sortOption)
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

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setSearchTerm(e.target.value)
  }

  const searchResults =
    useQuery(api.events.searchEventsByName, { name: searchTerm }) || []

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Events</h3>
        <EventCreator />
      </div>
      <div className="flex flex-col  gap-2 sm:flex-row sm:gap-5 sm:justify-between sm:items-center mb-8">
        <div className="flex relative">
          <Input
            type="text"
            placeholder="Search events by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2"
          />
          <Search className="w-4 h-4 absolute right-5 top-3 text-gray" />
          {/* <Button onClick={handleSearchClick} variant="outline">
            Search
          </Button> */}
        </div>
        <div>
          <Sort onSortChange={setSortOption} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3">
        {searchTerm
          ? searchResults.map((event) => (
              <EventItem key={event._id} {...event} />
            ))
          : sortedEvents.map((event) => (
              <EventItem key={event._id} {...event} />
            ))}
      </div>
    </>
  )
}
