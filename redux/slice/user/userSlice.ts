import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUser } from '../../thunks/userThunks'

type UserState = {
  id: string
  email: string
  role: string
  loading: boolean
}

type ApiRes = {
  id: string
  email: string
  role: string
}

const initialState: UserState = {
  id: '',
  email: '',
  role: '',
  loading: false,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogout: (state) => {
      state.id = ''
      state.email = ''
      state.role = ''
      state.loading = false
    },
    setLoggedIn: (state, action: PayloadAction<ApiRes>) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.role = action.payload.role
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.id = action.payload.id
        state.email = action.payload.email
        state.role = action.payload.role
        state.loading = false
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setLogout, setLoggedIn } = slice.actions
export default slice.reducer
