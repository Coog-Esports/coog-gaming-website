"use client";

import MonthView from "./month-view";
import { useViewStore } from "@/lib/store";
import DayView from "./day-view";
import WeekView from "./week-view";
import type { Event } from "@/db/schema/events";
import EventDialog from "../event-dialog";

interface MainViewProps{
  events: Event[]
}

export default function MainView({events}: MainViewProps) {
  const { selectedView } = useViewStore();
  return (
    <div className="flex">
      <div className="w-full flex-1">
        {selectedView === "month" && <MonthView events={events}/>}
        {selectedView === "week" && <WeekView events={events}/>}
        {selectedView === "day" && <DayView events={events}/>}
        <EventDialog />
      </div>
    </div>
  );
}
