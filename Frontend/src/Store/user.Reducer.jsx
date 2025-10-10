import { createSlice } from "@reduxjs/toolkit"
const initialState = {
  isAuthenticate: false,
  user: null, 
};


const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.user=action.payload;
            state.isAuthenticate = true
        },
        updateUser:(state,action)=>{
            if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
        },
        removeUser:(state,action)=>{
            state.user = null;
            state.isAuthenticate = false
        }
    }
})

export default userSlice.reducer;
export const {addUser, removeUser , updateUser} = userSlice.actions