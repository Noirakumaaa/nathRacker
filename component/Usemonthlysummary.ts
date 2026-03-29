import { useQuery } from '@tanstack/react-query';
import type { MonthlySummaryResponse } from './../app/types/SummaryType'; // or copy the types inline
import APIFETCH from 'lib/axios/axiosConfig';


async function fetchMonthlySummary(
  month: number,
  year: number,
): Promise<MonthlySummaryResponse> {
  const res = await APIFETCH.get(`/summary/monthly`, {params: { month, year },})
  return res.data;
}

export function useMonthlySummary(month: number, year: number) {
  return useQuery({
    queryKey: ['summary', 'monthly', month, year],
    queryFn: () => fetchMonthlySummary(month, year),
    staleTime: 1000 * 60 * 5, // 5 min — summary data doesn't change every second
  });
}