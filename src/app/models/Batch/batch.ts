interface ScheduleItem {
  day: string;
  time: string;
}

export interface BatchModel {
  batchName: string;
  course: string[];  // Array of course IDs
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  currentSemester: number;
  schedule: { day: string; time: string }[];
  sessionType: string;
  batchCoordinator: string;
  status: string;
}