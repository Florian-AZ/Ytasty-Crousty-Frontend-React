import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from '../../types/user.ts'

interface UserLoggedState {
    userLogged: User | null
    panier: number[] | null
}

const initialState: UserLoggedState = {
    userLogged: null,
    panier: null
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
        },
        setPanier: (state, action: PayloadAction<number>) => {
            const id = action.payload
            if (!state.panier) {
                state.panier = [id]
            } else {
                state.panier.push(id)
            }
            console.log("Panier ajoutée")
            console.log(JSON.parse(JSON.stringify(state.panier)))
        },
        clearPanier: (state, action: PayloadAction<number>) => {
            const id = action.payload
            if (state.panier) {
                if (state.panier.length === 1) {
                    state.panier = []
                } else {
                    state.panier = state.panier.filter((favId) => favId !== id)
                }
            }

            console.log("supprimé")
            console.log(JSON.parse(JSON.stringify(state.panier)))
        }
    },
})

export const { setUserLogged, clearUserLogged, setPanier, clearPanier } = userLoggedSlice.actions

export default userLoggedSlice.reducer
