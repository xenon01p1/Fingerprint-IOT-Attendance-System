import { fetcher } from '../../../services/fetcher';

export type Attendance = {
  id: number;
  name: string;
};

export async function getAttendance() {
  return fetcher<Attendance[]>('/attendance');
}