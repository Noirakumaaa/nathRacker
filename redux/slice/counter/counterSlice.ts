import { createSlice } from '@reduxjs/toolkit'

type CounterState = { value: number }
const initialState: CounterState = { value: 0 }

const slice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => { state.value += 1 },
    reset: state => { state.value = 0 }
  }
})

export const { increment, reset } = slice.actions
export default slice.reducer
