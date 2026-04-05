import { useQuery } from "@tanstack/react-query"
import APIFETCH from "lib/axios/axiosConfig"

export function useUserSettings() {
 
  return useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await APIFETCH.get("/settings/UserInfo")
      return res.data
    },
    staleTime: 1000 * 60 * 10,
  })
}