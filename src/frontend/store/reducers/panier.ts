import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/produit.ts";

interface PanierState {
    panier: Product[]
}

const initialState: PanierState = {
    panier: [],
}

export const panierSlice = createSlice({
    name: 'panier',
    initialState,
    reducers: {
        setPanier: (state, action: PayloadAction<Product>) => {
            (state.panier).push(action.payload)
        },
    },
})

export const { setPanier } = panierSlice.actions

export default panierSlice.reducer