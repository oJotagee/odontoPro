import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/lib/utils";

import { isToday, isSlotInThePast, isSlotSequenceAvailable } from "./schedule-utils";

interface ScheduleTimesListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimesSlots: TimeSlot[];
  clinicTimes: string[];
  onSelectTime: (time: string) => void;
}

export function ScheduleTimesList({
  selectedDate,
  selectedTime,
  requiredSlots,
  blockedTimes,
  availableTimesSlots,
  clinicTimes,
  onSelectTime
}: ScheduleTimesListProps) {
  const dateIsToday = isToday(selectedDate);

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
      {availableTimesSlots.map((slot) => {
        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes
        );

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
        const slotEnabled = slot.isAvailable && sequenceOK && !slotIsPast;


        return (
          <Button
            type="button"
            variant="outline"
            key={slot.time}
            className={cn("h-10 select-none cursor-pointer", 
              selectedTime === slot.time && "border-2 border-emerald-500 text-primary cursor-not-allowed",
              !slotEnabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            disabled={!slotEnabled}
          >
            {slot.time}
          </Button>
        );
      })}
    </div>
  )
}