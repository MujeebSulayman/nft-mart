import { buyNft } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { globalStates } from '@/store/states/globalStates'
import { NftStruct, RootState } from '@/utils/type.dt'
import { useRouter } from 'next/router'
import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const BuyNft: React.FC<{ nft: NftStruct }> = ({ nft }) => {
  const router = useRouter()
  const { saleModal } = useSelector((state: RootState) => state.globalStates)
  const { address } = useAccount()
  const { setSaleModal } = globalActions
  const dispatch = useDispatch()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) {
      toast.warn('Kindly connect your wallet')
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await buyNft(nft)
            .then((tx) => {
              console.log(tx)
              onClose() // Close the modal
              resolve(tx)
              router.push(`/nfts/${nft.id}`)
            })
            .catch((error) => {
              reject(error)
            })
        }),
        {
          pending: 'Approve transaction...',
          success: 'Nft purchased successfully',
          error: 'Encountered an error',
        }
      )
    }
  }
  const onClose = () => {
    dispatch(setSaleModal('scale-0'))
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
        bg-black bg-opacity-50 backdrop-blur-sm transform z-50 transition-transform duration-300 ${saleModal}`}
    >
      <div
        ref={modalRef}
        className="bg-white text-gray-800 shadow-xl rounded-2xl w-11/12 md:w-96 p-8"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-600">Buy Nft</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold">Price: {nft.price} ETH</h3>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>You are purchasing NFT:</p>
            <p className="font-semibold text-indigo-600">{nft.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyNft
