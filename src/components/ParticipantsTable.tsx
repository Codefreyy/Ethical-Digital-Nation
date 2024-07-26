import React, { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "./DataTable"

type Participant = {
  _id: string & {
    __tableName: "users"
  }
  _creationTime: number
  name?: string | undefined
  image?: any
  username?: string | undefined
  role?: string | undefined
  organization?: string | undefined
  bio?: string | undefined
  researchInterests?: string | undefined
  email?: string | undefined
  tokenIdentifier: string
} | null

export type Participants = Participant[]

const ParticipantsTable = ({
  participants,
}: {
  participants: any | Participants
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleSelectAll = () => {
    if (selectedRows.length === participants?.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(participants.map((p: Participant) => p?._id!))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const columns: ColumnDef<Participant>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={selectedRows.length === participants.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={selectedRows.includes(row.original?._id!)}
            onCheckedChange={() => {
              handleSelectRow(row.original?._id!)
            }}
          />
        )
      },
    },
    {
      id: "name",
      header: "Full Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={row.original?.image}
            alt=""
          />
          <span className="ml-4">{row.original?.name}</span>
        </div>
      ),
    },
    { id: "username", header: "Username", accessorKey: "username" },
    { id: "email", header: "Email", accessorKey: "email" },
    { id: "organization", header: "Organization", accessorKey: "organization" },
    { id: "role", header: "Role", accessorKey: "role" },
    {
      id: "researchInterests",
      header: "Research Interests",
      accessorKey: "researchInterests",
    },
  ]

  return <DataTable columns={columns} data={participants} />
}

export default ParticipantsTable
