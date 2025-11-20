"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateInputProps } from "../type";
import { Label } from "@/components/ui/label";
import NIcon from "@/components/NIcon";
import { cn } from "@/lib/utils";
import BaseInput from "../Box";
import { getIconColorProps } from "../utils";
import { useEffect } from "react";

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className = "",
  icon,
  showIcon = true,
  iconColor,
  variant = 'default',
  status = 'default',
}) => {

  const shouldDisplayLeftIcon = Boolean(icon) && showIcon;
  const shouldDisplayRightIcon = !icon && showIcon;
  const iconProps = getIconColorProps(iconColor, "h-4 w-4");


  const toDateString = (date) => date?.toISOString().split('T')[0];

  useEffect(() => {
    value instanceof Date && onChange(toDateString(value));
  }, [value, onChange]);

  const handleDateSelect = (date) => {
    onChange(toDateString(date));
  };

  return (
    <BaseInput variant={variant} status={status} className={cn('h-9', className)}>
      {shouldDisplayLeftIcon && (
        <NIcon
          icon={icon}
          className={iconProps.className}
          style={iconProps.style}
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "w-full flex items-center cursor-pointer gap-2 justify-start text-left font-normal relative ",
            !value && "text-foreground",
          )}
          >
            <Label className="text-muted-foreground cursor-pointer">
              {value ? format(
                typeof value === 'string' ? new Date(value) : value,
                "PPP"
              ) : placeholder}
            </Label>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={typeof value === 'string' ? new Date(value) : value}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {shouldDisplayRightIcon && (
        <CalendarIcon
          className={iconProps.className}
          style={iconProps.style}
        />
      )}
    </BaseInput>
  );
};

export default DateInput