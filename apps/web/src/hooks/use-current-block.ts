"use client";

import { useMemo } from "react";

export interface ScheduleBlock {
  id: number;
  persona_id: number;
  start_time: string;
  end_time: string;
  activity: string;
  is_prayer_block: boolean;
  persona_name?: string;
  persona_color?: string;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function useCurrentBlock(blocks: ScheduleBlock[], now: Date) {
  return useMemo(() => {
    const mins = now.getHours() * 60 + now.getMinutes();
    const sorted = [...blocks].sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (mins >= timeToMinutes(sorted[i].start_time)) {
        const endMins = timeToMinutes(sorted[i].end_time);
        if (endMins > timeToMinutes(sorted[i].start_time) && mins < endMins) {
          return sorted[i];
        }
        if (endMins <= timeToMinutes(sorted[i].start_time)) {
          return sorted[i]; // wraps midnight
        }
      }
    }
    return sorted[0] || null;
  }, [blocks, now]);
}
