import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Product} from "../../types/produit.ts";

interface ProductsState {
    products: Product[]
}

const initialState: ProductsState = {
    products: [],
}

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProduct: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload
        },
    },
})

export const {setProduct} = productsSlice.actions

export default productsSlice.reducer