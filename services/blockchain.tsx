import { ethers } from 'ethers'
import address from '../contracts/contractAddress.json'
import abi from '../artifacts/contracts/Nftmart.sol/Nftmart.json'
import { NftParams, NftStruct, SaleStruct } from '@/utils/type.dt'
import { store } from '@/store'
import { globalActions } from '@/store/globalSlices'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum

const {setNft, setSales} = globalActions

const getEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum)
  const signer = await provider.getSigner()
  const contracts = new ethers.Contract(address.Nftmart, abi.abi, signer)

  return contracts
}



const createNft = async (nft: NftParams): Promise<void> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }

  try {
    const contract = await getEthereumContract()
    tx = await contract.createNft(
      nft.name,
      nft.description,
      nft.imageUrl,
      nft.endTime,
      toWei(Number(nft.price))
    )
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateNft = async (nft: NftParams): Promise<void> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.updateNft(
      nft.id,
      nft.name,
      nft.description,
      nft.imageUrl,
      nft.endTime,
      toWei(Number(nft.price))
    )
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteNft = async (nftId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.deleteNft(nftId)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const payout = async (nftId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.payout(nftId)
    await tx.wait()

    const nftData: NftStruct = await getSingleNft(nftId)
    store.dispatch(setNft(nftData))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const buyNft = async (nft: NftStruct) => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.buyNft(nft.id, { value: toWei(nft.price) })

    const nftData: NftStruct = await getSingleNft(nft.id)
    store.dispatch(setNft(nftData))

    const salesData: SaleStruct[] = await getSale(nft.id)
    store.dispatch(setSales(salesData))

    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getAllNfts = async (): Promise<NftStruct[]> => {
  try {
    const contract = await getEthereumContract()
    console.log('Contract instance:', contract)
    const nfts = await contract.getAllNfts()
    console.log('Raw NFTs data:', nfts)
    return structuredNft(nfts)
  } catch (error) {
    console.error('Error in getAllNfts:', error)
    throw error
  }
}

const getSingleNft = async (nftId: number): Promise<NftStruct> => {
  const contract = await getEthereumContract()
  const nft = await contract.getSingleNft(nftId)
  return structuredNft(nft)[0]
}

const getMyNfts = async (): Promise<NftStruct[]> => {
  const contract = await getEthereumContract()
  const nfts = await contract.getMyNfts()
  return structuredNft(nfts)
}

const getSale = async (nftId: number): Promise<SaleStruct[]> => {
  const contract = await getEthereumContract()
  const sale = await contract.getSale(nftId)
  return structuredSale(sale)
}

const getAllSales = async (): Promise<SaleStruct[]> => {
  const contract = await getEthereumContract()
  const sales = await contract.getAllSales()
  return structuredSale(sales)
}

const getMySales = async (): Promise<SaleStruct[]> => {
  const contract = await getEthereumContract()
  const sales = await contract.getMySales()
  return structuredSale(sales)
}

const transferOwnership = async (nftId: number, newOwner: string): Promise<void> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.transferOwnership(nftId, newOwner)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const mintNft = async (nftId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    tx = await contract.mintNft(nftId)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const structuredNft = (nfts: NftStruct[]): NftStruct[] =>
  nfts
    .map((nft) => ({
      id: Number(nft.id),
      name: nft.name,
      imageUrl: nft.imageUrl,
      description: nft.description,
      owner: nft.owner,
      price: parseFloat(fromWei(nft.price)),
      timestamp: Number(nft.timestamp),
      endTime: Number(nft.endTime),
      deleted: nft.deleted,
      minted: nft.minted,
      paidOut: nft.paidOut,
      refunded: nft.refunded,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredSale = (sales: SaleStruct[]): SaleStruct[] =>
  sales
    .map((sale) => ({
      id: Number(sale.id),
      nftId: Number(sale.nftId),
      owner: sale.owner,
      price: parseFloat(fromWei(sale.price)),
      timestamp: Number(sale.timestamp),
      endTime: Number(sale.endTime),
      minted: sale.minted,
      refunded: sale.refunded,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

export {
  createNft,
  updateNft,
  deleteNft,
  payout,
  buyNft,
  getAllNfts,
  getSingleNft,
  getMyNfts,
  getSale,
  getAllSales,
  getMySales,
  transferOwnership,
  mintNft,
}
