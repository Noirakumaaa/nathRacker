import { createAsyncThunk } from '@reduxjs/toolkit'

type UserState = {
  id: string
  govUsername: string
  email: string
  role: string
  loading: boolean
  firstName: string
  lastName: string
} 


export const fetchUser = createAsyncThunk<UserState>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/auth/check-auth`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Unauthorized')
      

      const data: UserState = await res.json()
      return data
    } catch (err) {
      return rejectWithValue('Network error')
    }
  }
)
