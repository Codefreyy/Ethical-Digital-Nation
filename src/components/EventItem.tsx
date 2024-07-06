import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

export default function EventItem({
  name,
  description,
  date,
  location,
}: {
  name: string
  description: string
  date: string
  location: string
}) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="sm:text-xl text-md">{name}</CardTitle>
        <div className="absolute top-2 right-2">
          {/* <FileCardActions file={file} /> */}
        </div>
        <CardDescription>
          {formatDate(date)} - {location}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
