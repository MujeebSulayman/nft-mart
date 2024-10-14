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
  const { sales, setSales } = useState<number | string>('')
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
          success: 'Ticket purchased successfully',
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
            <h2 className="text-2xl font-bold text-indigo-600">Buy NFT</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <form onSubmit={handleSubmit}  space-y-6>
            <div></div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyNft
