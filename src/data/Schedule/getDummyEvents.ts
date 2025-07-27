/**
 * This file provides a mock data for render the schedule blocks.
 * @author: Daekyun Kim
 */

import type { EventData } from '../../types/event';

const getDummyEvents = (): EventData[] => [
  {
    id: '1',
    title: 'Event 1',
    day: 'Mon',
    startTime: { hour: 9, minute: 15 },
    endTime: { hour: 11, minute: 5 },
    color: 'pink',
  },
  {
    id: '2',
    title: 'Event 2',
    day: 'Tue',
    startTime: { hour: 10, minute: 0 },
    endTime: { hour: 11, minute: 0 },
    color: 'blue',
  },
  {
    id: '3',
    title: 'Event 3',
    day: 'Wed',
    startTime: { hour: 14, minute: 15 },
    endTime: { hour: 14, minute: 30 },
    color: 'blue',
  },
];

export default getDummyEvents;
