import { createSlice } from '@reduxjs/toolkit'
import { fetchBus, fetchRecentBus } from '../../thunks/busThunks'

type BusForm = {
  id: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  updateInfo: string;
  remarks: string;
  issue: string;
  encodedBy: string;
  subjectOfChange: string;
  drn: string;
  cl: string;
  date: string;
  note: string;
};



type BusField = {
  id: number;
  userId: number;
  username: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  updateInfo: string;
  typeOfUpdate: string;
  issue: string;
  subjectOfChange: string;
  date: string;
  createdAt: string
  updatedAt: string
};


type Bus = { 
  date: string
  encoded: number
  issues: number
  updated: number
}

type BusState = {
  recentBus : BusField[]
  dailyEncodingData: Bus[]
  currentBusForm: BusForm | null
  loading: boolean
  newData : boolean
}

const initialState: BusState = { 
  recentBus: [],
  dailyEncodingData: [],
  currentBusForm: {
    id: "",
    lgu: '',
    barangay: '',
    hhId: '',
    granteeName: '',
    typeOfUpdate: '',
    updateInfo: "",
    remarks: '',
    issue: '',
    encodedBy: '',    
    subjectOfChange: '',
    drn: '',
    cl: '',
    date: '',
    note: '',
  },
  loading: true,
  newData : false
}

const slice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setCurrentBusForm: (state, action: { payload: BusForm }) => {
      state.currentBusForm = action.payload
    },
    setNewData: (state, action: { payload: boolean }) => {
      state.newData = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBus.fulfilled, (state, action) => {
        state.dailyEncodingData = action.payload
        state.loading = false
      })
      .addCase(fetchBus.rejected, (state) => {
        state.loading = false
      })
      .addCase(fetchRecentBus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRecentBus.fulfilled, (state, action) => {
      
        state.recentBus = action.payload
        state.loading = false
      })
      .addCase(fetchRecentBus.rejected, (state) => {
        state.loading = false
      })
  }
})


export const { setCurrentBusForm, setNewData } = slice.actions
export default slice.reducer
