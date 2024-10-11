import { ethers } from 'ethers'
import address from '../contracts/contractAddress.json'
import abi from '../artifacts/contracts/Nftmart.sol/Nftmart.json'
import { NftParams, NftStruct } from '@/utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum

// const { setNfts, setSales } = globalActions //Take a look at this later

const getEthereumContract = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.Nftmart, abi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address.Nftmart, abi.abi, signer)

    return contracts
  }
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
    //()if i am interested in updating the page without reload using redux, the code should go here
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
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getAllNfts = async (): Promise<NftStruct> => {
  if (!ethereum) {
    reportError('Kindly install a wallet provider')
    return Promise.reject(new Error('Browser provider not available on your device'))
  }
  try {
    const contract = await getEthereumContract()
    const nfts = await contract.getAllNfts()
    return ////////////////////////////
  } catch (error) {
    reportError(error)
    return error
  }
}

export { createNft, updateNft, deleteNft, payout, buyNft }
