"use client";

import NumberFlow from "@number-flow/react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { memo, useState } from "react";
import { EventName } from "../../../../api/analytics/useGetEventNames";
import { useGetEventProperties } from "../../../../api/analytics/useGetEventProperties";
import { NothingFound } from "../../../../components/NothingFound";
import { EventProperties } from "./EventProperties";

// Skeleton component for EventList
const EventListSkeleton = memo(
  ({ size = "small" }: { size?: "small" | "large" }) => {
    // Generate widths following Pareto principle with top item at 100%
    const widths = Array.from({ length: 10 }, (_, i) => {
      if (i === 0) {
        // First item always has 100% width
        return 100;
      } else if (i === 1) {
        // Second item gets large width (60-80%)
        return 60 + Math.random() * 20;
      } else {
        // Remaining 8 items get progressively smaller widths (10-40%)
        const factor = 1 - (i - 2) / 8; // Creates a declining factor from 1 to 0.125
        return 10 + factor * 30; // Creates widths from ~40% down to ~15%
      }
    });

    // Generate random widths for label and value placeholders
    const labelWidths = Array.from({ length: 10 }, (_, i) => {
      // First few items get wider labels
      return i < 3 ? 75 + Math.random() * 100 : 40 + Math.random() * 60;
    });

    const valueWidths = Array.from(
      { length: 10 },
      () => 20 + Math.random() * 40 // Between 20px and 60px
    );

    return (
      <div className="flex flex-col gap-2 pr-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`relative ${
              size === "small" ? "h-6" : "h-9"
            } flex items-center`}
          >
            <div
              className="absolute inset-0 bg-neutral-800 py-2 rounded-md animate-pulse"
              style={{ width: `${widths[index]}%` }}
            ></div>
            <div
              className={`z-5 mx-2 flex justify-between items-center ${
                size === "small" ? "text-xs" : "text-sm"
              } w-full`}
            >
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-neutral-800 rounded animate-pulse mr-1"></div>
                <div
                  className="h-4 bg-neutral-800 rounded animate-pulse"
                  style={{ width: `${labelWidths[index]}px` }}
                ></div>
              </div>
              <div
                className={`${
                  size === "small" ? "text-xs" : "text-sm"
                } flex gap-2`}
              >
                <div
                  className="h-4 bg-neutral-800 rounded animate-pulse"
                  style={{ width: `${valueWidths[index]}px` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

interface EventListProps {
  events: EventName[];
  isLoading: boolean;
  size?: "small" | "large";
}

export function EventList({
  events,
  isLoading,
  size = "small",
}: EventListProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const handleEventClick = (eventName: string) => {
    setExpandedEvent(expandedEvent === eventName ? null : eventName);
  };

  const { data: eventPropertiesData, isLoading: isLoadingProperties } =
    useGetEventProperties(expandedEvent);

  if (isLoading) {
    return <EventListSkeleton size={size} />;
  }

  if (!events || events.length === 0) {
    return size === "small" ? (
      <div className="text-neutral-300 w-full text-center mt-6 flex flex-row gap-2 items-center justify-center">
        <Info className="w-5 h-5" />
        No Data
      </div>
    ) : (
      <NothingFound
        title={"No custom events found"}
        description={"Try a different date range or filter"}
      />
    );
  }

  // Find the highest count to calculate percentages
  const maxCount = Math.max(...events.map((event) => event.count));

  return (
    <div className="flex flex-col gap-2">
      {events.map((event) => {
        const percentage = (event.count / maxCount) * 100;
        const isExpanded = expandedEvent === event.eventName;

        return (
          <div key={event.eventName} className="flex flex-col">
            {/* Event Row */}
            <div
              className={`relative ${
                size === "small" ? "h-6" : "h-9"
              } flex items-center cursor-pointer hover:bg-neutral-850 group px-2 rounded-md`}
              onClick={() => handleEventClick(event.eventName)}
            >
              <div
                className="absolute inset-0 bg-dataviz py-2 opacity-25 rounded-md"
                style={{ width: `${percentage}%` }}
              ></div>
              <div
                className={`z-10 flex justify-between items-center ${
                  size === "small" ? "text-xs" : "text-sm"
                } w-full`}
              >
                <div className="font-medium truncate max-w-[70%] flex items-center gap-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  )}
                  {event.eventName}
                </div>
                <div
                  className={`text-sm flex gap-2 ${
                    size === "small" ? "text-xs" : "text-sm"
                  }`}
                >
                  <div className="hidden group-hover:block text-neutral-400">
                    {Math.round(percentage * 10) / 10}%
                  </div>
                  <NumberFlow
                    respectMotionPreference={false}
                    value={event.count}
                    format={{ notation: "compact" }}
                  />
                </div>
              </div>
            </div>

            {/* Properties Section (Expanded) */}
            {isExpanded && (
              <div className="ml-4 mt-2 mb-4 border-l-2 border-neutral-800 pl-4">
                <EventProperties
                  properties={eventPropertiesData || []}
                  isLoading={isLoadingProperties}
                  selectedEvent={expandedEvent}
                  size={size}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
