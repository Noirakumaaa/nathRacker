import { createSlice } from '@reduxjs/toolkit'
// import { fetchSwdi, fetchSwdiCount } from '../../thunks/swdiThunks'
import type { SwdiFormFields, SwdiData } from '~/types/swdiTypes'





type SwdiCount = { 
  date: string
  encoded: number
  issues: number
  updated: number
}

type swdiState = {
  AllSwdi: SwdiData[]
  currentSwdi : SwdiFormFields
  SwdiCount : SwdiCount[]
  loading: boolean
  newData : boolean
}


const initialState: swdiState = { 
  AllSwdi: [],
  currentSwdi: {
    hhId: '',
    grantee: '',
    lgu: '',
    barangay: '',
    swdiScore: 1,
    swdiLevel: '',
    encodedBy: '',
    remarks: '',
    issue: '',
    cl: '',
    drn: '',
    note: '',
    date: '',
  },
  SwdiCount: [],
  loading: true,
  newData : false
}
const slice = createSlice({
  name: 'swdi',
  initialState,
  reducers: {
    setCurrentSwdiForm : (state, action : {payload : SwdiFormFields})=>{
      state.currentSwdi = action.payload
    },
    setNewData : (state, action : {payload : boolean})=>{
      state.newData = action.payload
    },
  },

  
})


export const { setNewData, setCurrentSwdiForm } = slice.actions
export default slice.reducer
