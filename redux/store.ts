import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/counter/counterSlice';
import userReducer from './slice/user/userSlice';
import busReducer from './slice/bus/busSlice'
import swdiReducer from './slice/swdi/swdiSlice'
import dashboardReducer from './slice/dashboard/dashboardSlice'
import pcnReducer from './slice/pcn/pcnSlice'
import summaryReducer from './slice/summary/summerySlice'
import cvsReducer from './slice/cvs/cvsSlice'


export const store = configureStore({
  reducer: { 
    counter: counterReducer, 
    user: userReducer, 
    bus : busReducer, 
    swdi : swdiReducer, 
    dashboard : dashboardReducer, 
    pcn: pcnReducer,
    summary : summaryReducer,
    cvs : cvsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
