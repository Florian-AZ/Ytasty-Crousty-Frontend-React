import type {User} from "../../types/user.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface UsersState {
    users: User[]
}

const initialState: UsersState = {
    users: [],
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
        },
    },
})

export const {setUsers} = usersSlice.actions

export default usersSlice.reducer