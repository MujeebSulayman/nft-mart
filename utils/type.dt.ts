export interface TruncateParams {
  text: string
  startChars: number
  endChars: number
  maxLength: number
}

export interface NftParams {
  id?: number
  name: string
  description: string
  imageUrl: string
  endTime: string | number
  price: string | number
}

export interface SaleStruct {
  id: number
  nftId: number
  owner: string
  price: number
  timestamp: number
  endTime: number
  minted: boolean
  refunded: boolean
}

export interface NftStruct {
  id: number
  name: string
  imageUrl: string
  description: string
  owner: string
  price: number
  timestamp: number
  endTime: number
  deleted: boolean
  minted: boolean
  paidOut: boolean
  refunded: boolean
}

export interface GlobalState {
  nft: NftStruct | null
  sales: SaleStruct[]
  saleModal: string
}

export interface RootState {
  globalStates: GlobalState
}
