import type { PcnFields, Pcn } from "~/types/pcnTypes"
import { useMutation } from "@tanstack/react-query"
import { post } from "./fetchComponent"

export const usePcn = () => {
    return useMutation<Pcn, Error, PcnFields>({
        mutationFn: (body: PcnFields) =>
            post(`${import.meta.env.VITE_BACKEND_API_URL}/v1/pcn/insert`, body)
    })
}