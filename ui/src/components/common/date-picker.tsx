"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LanguageContext } from "@/i18n/language-context";
import { useContext } from "react";

interface DatePickerProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  dateFormat?: string;
  full?: boolean;
}

export const DatePicker = ({
  date,
  setDate,
  dateFormat = "MMM yyyy",
  full = false,
}: DatePickerProps) => {
  const { dictionary } = useContext(LanguageContext);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outlineSecondary"}
          className={cn(
            `${
              full ? "w-full" : "w-[200px] md:w-[280px]"
            } justify-start text-left font-normal border-input`,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, dateFormat)
          ) : (
            <span>{dictionary.PickADate}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
