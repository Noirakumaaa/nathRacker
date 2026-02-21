import { useMutation } from "@tanstack/react-query"
import type { UserState, LoginInput, RegisterInput} from "~/types/authTypes"
import { post } from "./fetchComponent"



export const useLogin = () => {
  return useMutation<UserState, Error, LoginInput>({
    mutationFn: (body: LoginInput) =>
      post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/login`, body)
  })
}

export const useRegister = () => {
  return useMutation<UserState, Error, RegisterInput>({
    mutationFn: (body: RegisterInput) =>
      post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/register`, body) 
  })
}
