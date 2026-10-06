import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/produit.ts";

interface PanierState {
    panier: ProduitPanier[]
}

interface ProduitPanier {
    produit : Product,
    quantite : number 
}

const initialState: PanierState = {
    panier : []
}

export const panierSlice = createSlice({
    name: 'panier',
    initialState,
    reducers: {
        ajouterPanier: (state, action: PayloadAction<ProduitPanier>) => {
            const produitDejaPresent = (state.panier).find((element) => element.produit.id === action.payload.produit.id)
            if (produitDejaPresent) {
                produitDejaPresent.quantite += 1
            }
            else {
            (state.panier).push(action.payload)
            }
        },
        retirerPanier: (state, action: PayloadAction<ProduitPanier>) => {
            const produitDejaPresent = (state.panier).find((element) => element.produit.id === action.payload.produit.id)
            if (produitDejaPresent && produitDejaPresent.quantite > 1 ) {
                produitDejaPresent.quantite -= 1
            } else if (produitDejaPresent && produitDejaPresent.quantite === 1) {
            const indexProduit = state.panier.findIndex(
  (element) => element.produit.id === action.payload.produit.id
);

state.panier.splice(indexProduit, 1);
            }
        },
         viderPanier:  (state) => {
            state.panier = []
         }
    },
})

export const { viderPanier,ajouterPanier,retirerPanier } = panierSlice.actions

export default panierSlice.reducer