import { MapPin } from "lucide-react"

interface LocationBadgeProps {
  city: string,
  province: string,
}

export default function LocationBadge({city, province}: LocationBadgeProps) {
  return (<span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-lake-800 bg-lake-200">
    <MapPin /> {city}, {province}
  </span>)
}
