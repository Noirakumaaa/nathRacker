import { createSlice } from "@reduxjs/toolkit"


const now = new Date()
const month = now.getMonth() + 1
export type EncodedDocument = {
  id: number
  hhId: string
  name: string
  documentType: string
  documentId: number
  encoded: string
  userId: number
  username: string
  date: string
  createdAt: string
}

type PcnState = {
  EncodedDocument: EncodedDocument[]
  selectedMonth: string
  newData: boolean
}

const initialState: PcnState = {
  EncodedDocument: [],
  selectedMonth: month.toString(),
  newData: false,
}

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: { 
    setSelectedMonth: (state, action: {payload : string}) => { 

      state.selectedMonth = action.payload
    },
  },
})

export const { setSelectedMonth } = summarySlice.actions
export default summarySlice.reducer
