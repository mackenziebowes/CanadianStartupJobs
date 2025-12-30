import { Building, HouseWifi } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface RemoteBadgeProps {
  remoteOk: boolean,
  separator?: "left" | "right",
}

export default function RemoteBadge({remoteOk, separator}: RemoteBadgeProps) {

  return (
    <>
      {(separator == "left") && <Separator orientation="vertical" className="bg-foreground" />}
      {(remoteOk == true) && (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-pine-800 bg-pine-200">
            <HouseWifi /> Remote
          </span>
      )}
      {(remoteOk == false) && (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-md font-medium text-aurora-800  bg-aurora-200">
            <Building /> In Office
          </span>
      )}
      {(separator == "right") && <Separator orientation="vertical" className="bg-foreground" />}
    </>
  )
}
