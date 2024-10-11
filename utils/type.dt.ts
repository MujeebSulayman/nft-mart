export interface NftParams {
  id?: number
  name: string
  description: string
  imageUrl: string
  endTime: string | number
  price: string | number
}

export interface SalesStruct {
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
  owner: number
  price: number
  timestamp: number
  endTime: number
  deleted: boolean
  minted: boolean
  paidOut: boolean
  refunded: boolean
}
