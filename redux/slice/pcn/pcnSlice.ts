// redux/slice/pcn/pcnSlice.ts
import { createSlice } from "@reduxjs/toolkit"
import type { PcnFormFields } from "./../../../app/types/pcnTypes"

type PcnState = {
  currentPcn: PcnFormFields | null
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
    setCurrentPcnForm: (state, action: { payload: PcnFormFields }) => {
      state.currentPcn = action.payload
      console.log("Current PCN set in slice:", state.currentPcn);
    },
    clearCurrentPcn: (state) => {
      state.currentPcn = null
    },
    setNewData: (state, action: { payload: boolean }) => {
      state.newData = action.payload
    },
  },
})

export const { setCurrentPcnForm, clearCurrentPcn, setNewData } = pcnSlice.actions
export default pcnSlice.reducer
