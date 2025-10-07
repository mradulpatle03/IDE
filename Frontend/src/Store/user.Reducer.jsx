import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    isAuthenticate: false
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        addUser:(state)=>{
            state.isAuthenticate = true
        },
        removeUser:(state,action)=>{
            state.isAuthenticate = false
        }
    }
})

export default userSlice.reducer;
export const {addUser, removeUser} = userSlice.actions