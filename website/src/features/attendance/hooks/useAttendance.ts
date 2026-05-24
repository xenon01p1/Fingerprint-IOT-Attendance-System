import { useQuery } from '@tanstack/react-query';
import { getAttendance } from '../api/getAttendance';

export function useAttendance() {
  return useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendance,
  });
}