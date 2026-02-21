import { createSlice } from '@reduxjs/toolkit'
// import { fetchSwdi, fetchSwdiCount } from '../../thunks/swdiThunks'

type Swdi = { 
    id : number;
    hhId : string;
    grantee : string;
    swdiScore : string;
    encoded: string;
    issue : string;
    date: string;
    userId: number;
    username: string
    createdAt?: string
    updatedAt?: string
}


type SWDIFormFields = { 
    hhId : string;
    grantee : string;
    swdiScore : string;
    encoded: string;
    issue? : string;
    date: string;

}

type SwdiCount = { 
  date: string
  encoded: number
  issues: number
  updated: number
}

type swdiState = {
  AllSwdi: Swdi[]
  currentSwdi : SWDIFormFields
  SwdiCount : SwdiCount[]
  loading: boolean
  newData : boolean
}

const initialState: swdiState = { 
  AllSwdi: [],
  currentSwdi: {

    hhId: '',
    grantee: '',
    swdiScore: '',
    encoded: '',
    issue: '',
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
    setCurrentSwdi : (state, action : {payload : SWDIFormFields})=>{
      state.currentSwdi = action.payload
    },
    setNewData : (state, action : {payload : boolean})=>{
      state.newData = action.payload
    },
  },
  // extraReducers: builder => {
  //   builder
  //     .addCase(fetchSwdi.pending, (state) => {
  //       state.loading = true
  //     })
  //     .addCase(fetchSwdi.fulfilled, (state, action) => {
  //       state.AllSwdi = action.payload
  //       state.loading = false
  //     })
  //     .addCase(fetchSwdi.rejected, (state) => {
  //       state.loading = false
  //     })
      
  // },
  
})


export const { setNewData, setCurrentSwdi } = slice.actions
export default slice.reducer
