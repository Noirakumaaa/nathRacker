import { createSlice } from '@reduxjs/toolkit'
import { fetchBus, fetchRecentBus } from '../../thunks/busThunks'
import type { MiscFormFields } from '~/types/miscTypes';





type MiscState = {
  currentBusForm: MiscFormFields | null
  loading: boolean
  newData : boolean
}

const initialState: MiscState = { 

  currentBusForm: null,
  loading: true,
  newData : false
}

const slice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setCurrentMISCForm: (state, action: { payload: MiscFormFields }) => {
      state.currentBusForm = action.payload
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
  //     .addCase(fetchBus.fulfilled, (state, action) => {
  //       state.dailyEncodingData = action.payload
  //       state.loading = false
  //     })
  //     .addCase(fetchBus.rejected, (state) => {
  //       state.loading = false
  //     })
  //     .addCase(fetchRecentBus.pending, (state) => {
  //       state.loading = true
  //     })
  //     .addCase(fetchRecentBus.fulfilled, (state, action) => {
      
  //       state.recentBus = action.payload
  //       state.loading = false
  //     })
  //     .addCase(fetchRecentBus.rejected, (state) => {
  //       state.loading = false
  //     })
  // }
})


export const { setCurrentMISCForm, setNewData } = slice.actions
export default slice.reducer
