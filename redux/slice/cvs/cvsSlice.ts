import { createSlice } from '@reduxjs/toolkit'
import { fetchBus, fetchRecentBus } from '../../thunks/busThunks'

type CvsFormFields = {
  id?: number;
  idNumber: string;
  lgu: string;
  barangay: string;
  facilityName: string;
  formType: string;
  remarks: string;
  date: string;
}





type cvsState = {

  currentCVS: CvsFormFields | null
  loading: boolean
  newData : boolean
}

const initialState: cvsState = { 

  currentCVS : null,
  loading: true,
  newData : false
}

const slice = createSlice({
  name: 'cvs',
  initialState,
  reducers: {
    setCurrentCVSForm: (state, action: { payload: CvsFormFields }) => {
      state.currentCVS = action.payload
    },
    setNewData: (state, action: { payload: boolean }) => {
      state.newData = action.payload
    }
  },
  // extraReducers: builder => {
  //   builder
  //     .addCase(fetchBus.pending, (state) => {
  //       state.loading = true
  //     })
  //     .addCase(fetchBus.rejected, (state) => {
  //       state.loading = false
  //     })
  //     .addCase(fetchRecentBus.pending, (state) => {
  //       state.loading = true
  //     })
  //     .addCase(fetchRecentBus.rejected, (state) => {
  //       state.loading = false
  //     })
  // }
})


export const { setCurrentCVSForm, setNewData } = slice.actions
export default slice.reducer
