import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUser } from '../../thunks/userThunks'

type UserState = {
  id: string
  email: string
  role: string
  govUsername?: string
  firstName: string
  lastName: string
  loading: boolean
}

type ApiRes = {
  id: string
  email: string
  role: string
  govUsername?: string
  firstName: string
  lastName: string
}

const initialState: UserState = {
  id: '',
  email: '',
  role: '',
  govUsername: '',
  firstName: '',
  lastName: '',
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
      state.govUsername = action.payload.govUsername
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
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
        state.govUsername = action.payload.govUsername
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        
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
