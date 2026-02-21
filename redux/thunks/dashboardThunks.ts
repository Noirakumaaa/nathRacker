import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchDashboard = createAsyncThunk(
  'bus/fetchDashboard',
  async ({ userId, days }: { userId: string; days: string }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/count?userId=${userId}&days=${days}`, {
      method: 'GET',
      credentials: 'include',
    })

    return await res.json()
  }
)
