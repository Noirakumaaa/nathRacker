// redux/slice/pcn/pcnSlice.ts
import { createSlice } from "@reduxjs/toolkit"

export type Pcn = {
  id?: number
  hhId: string
  name: string
  pcn: string
  tr: string
  encoded: "YES" | "NO" | "UPDATED" | "PENDING"
  issue?: string
  date: string
  userId: number
  username: string
  createdAt?: string
  updatedAt?: string
}

type PcnState = {
  currentPcn: Pcn | null
  newData: boolean
}

const initialState: PcnState = {
  currentPcn: null,
  newData: false,
}

const pcnSlice = createSlice({
  name: "pcn",
  initialState,
  reducers: {
    setCurrentPcn: (state, action: { payload: Pcn }) => {
      state.currentPcn = action.payload
    },
    clearCurrentPcn: (state) => {
      state.currentPcn = null
    },
    setNewData: (state, action: { payload: boolean }) => {
      state.newData = action.payload
    },
  },
})

export const { setCurrentPcn, clearCurrentPcn, setNewData } = pcnSlice.actions
export default pcnSlice.reducer
