/**
 * Interface for Event Data used in the Scheduler Table and other components.
 * Represents a single scheduled event including its time, day, and color.
 * 
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
export interface EventData {
    id: string;
    title: string;
    day: string;
    startTime: { hour: number; minute: number };
    endTime: { hour: number; minute: number };
    color: string;
  }