"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFiltersContext } from "@/contexts/filters";

interface IndustriesProps {
  options: {
    label: string,
    value: number
  }[]
};

export default function IndustriesComboBox({options}: IndustriesProps) {
  const [open, setOpen] = React.useState(false)
  const { filters, setFilter } = useFiltersContext();
  const currentValue = filters.industry;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between"
        >
          {currentValue
            ? options.find((option) => option.value === currentValue)?.label
            : "Any Industry"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search Levels..." />
          <CommandList>
            <CommandEmpty>No industry found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={(newValue) => {
                    setFilter("industry", newValue === currentValue.toString() ? 0 : parseInt(newValue))
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
