import type {Restaurant} from "../../types/restaurant.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface RestaurantsState {
    restaurants: Restaurant[]
}

const initialState: RestaurantsState = {
    restaurants: [],
}

export const restaurantsSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
            state.restaurants = action.payload
        },
    },
})

export const {setRestaurants} = restaurantsSlice.actions

export default restaurantsSlice.reducer