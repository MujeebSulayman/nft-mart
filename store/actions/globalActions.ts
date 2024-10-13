import { GlobalState, NftStruct, SaleStruct } from '@/utils/type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setSales: (states: GlobalState, action: PayloadAction<SaleStruct[]>) => {
    states.sales = action.payload
  },

  setNft: (states: GlobalState, action: PayloadAction<NftStruct | null>) => {
    states.nft = action.payload
  },

  setSaleModal: (states: GlobalState, action: PayloadAction<string>) => {
    states.saleModal = action.payload
  },
}
