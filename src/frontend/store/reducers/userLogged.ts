import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {User} from '../../types/user.ts'

interface UserLoggedState {
    userLogged: User | null
}

const initialState: UserLoggedState = {
    userLogged: null,
}

export const userLoggedSlice = createSlice({
    name: 'userLogged',
    initialState,
    reducers: {
        setUserLogged: (state, action: PayloadAction<User | null>) => {
            state.userLogged = action.payload
        },
        clearUserLogged: (state) => {
            state.userLogged = null
            localStorage.removeItem("access_token")
        }
    },
})

export const {setUserLogged, clearUserLogged} = userLoggedSlice.actions

export default userLoggedSlice.reducer