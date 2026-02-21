import { createSlice } from '@reduxjs/toolkit'
import { fetchDashboard } from '../../thunks/dashboardThunks'

type Data = {
  total_encoded: number;
  encoded: number;
  issues: number;
  updated: number;
};

type EncodedState = {
  overall_data: Data;
  loading: boolean;
};

const initialState: EncodedState = {
  overall_data: { total_encoded: 0, encoded: 0, issues: 0, updated: 0 },
  loading: true,
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.overall_data = action.payload
        state.loading = false
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false
      })
  }
})

export default slice.reducer
