import { configureStore } from "@reduxjs/toolkit";
import usersReducer from './reducers/users'
import userLoggedReducer from './reducers/userLogged'
import restaurantsReducer from './reducers/restaurants'
import productsReducer from './reducers/products'
import loadingReducer from './reducers/loading'

export const store = configureStore({
    reducer: {
        users : usersReducer,
        userLogged: userLoggedReducer,
        restaurants: restaurantsReducer,
        products: productsReducer,
        loading: loadingReducer
    },
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']