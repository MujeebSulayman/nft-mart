import { Menu, Transition } from '@headlessui/react'
import { BsThreeDotsVertical, BsTrash, BsPencilSquare, BsCashCoin, BsX } from 'react-icons/bs'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { NftStruct } from '@/utils/type.dt'
import { useRouter } from 'next/router'
import { deleteNft, mintNft, payout } from '@/services/blockchain'

const NftAction: React.FC<{ nft: NftStruct }> = ({ nft }) => {
  const { address } = useAccount()
  const router = useRouter()
  const [isAbove, setIsAbove] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const checkPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setIsAbove(spaceBelow < 200) // Adjust this value based on your menu height
      }
    }

    checkPosition()
    window.addEventListener('resize', checkPosition)
    return () => window.removeEventListener('resize', checkPosition)
  }, [])

  const handleDelete = async () => {
    if (!address) return toast.warn('Connect wallet first')
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false)
    await toast.promise(
      new Promise(async (resolve, reject) => {
        deleteNft(nft.id)
          .then(() => {
            resolve(nft)
            router.push('/')
          })
          .catch((error) => {
            reject(error)
          })
      }),
      {
        pending: 'Deleting Nft...',
        success: 'Nft deleted successfully',
        error: 'Encountered an error',
      }
    )
  }

  const handlePayout = async () => {
    if (!address) return toast.warn('Connect wallet first')

    const userConfirmed = window.confirm('Are you sure you want to payout this Nft?')
    if (!userConfirmed) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        payout(nft.id)
          .then(() => {
            resolve(nft)
            router.push(`/nfts/${nft.id}`)
          })
          .catch((error) => {
            reject(error)
          })
      }),
      {
        pending: 'Approve transaction...',
        success: 'Nft paid out successfully',
        error: 'Encountered an error',
      }
    )
  }

  const handleMint = async () => {
    if (!address) return toast.warn('Connect Wallet First')

    const userConfirmed = window.confirm('Are you sure you want to mint this Nft?')
    if (!userConfirmed) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        mintNft(nft.id)
          .then(() => {
            resolve(nft)
            router.push(`/nfts/${nft.id}`)
          })
          .catch((error) => {
            reject(error)
          })
      }),
      {
        pending: 'Approve transaction...',
        success: 'Nft paid out successfully',
        error: 'Encountered an error',
      }
    )
  }

  const handleTransfer = async () => {
    if (!address) return toast.warn('Connect Wallet First')
  }

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            ref={buttonRef}
            className="inline-flex justify-center items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Actions
            <BsThreeDotsVertical
              className="w-5 h-5 ml-2 -mr-1 text-indigo-200 hover:text-indigo-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute ${
              isAbove ? 'bottom-full mb-2' : 'top-full mt-2'
            } right-0 w-56 origin-top-right bg-gray-800 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={'/nfts/edit/' + nft.id}
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-200'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <BsPencilSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                    Edit
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-200'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={handlePayout}
                  >
                    <BsCashCoin className="w-5 h-5 mr-2" aria-hidden="true" />
                    Payout
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-200'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={handleMint}
                  >
                    <BsCashCoin className="w-5 h-5 mr-2" aria-hidden="true" />
                    Mint Nft
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-700 text-white' : 'text-gray-200'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={handleTransfer}
                  >
                    <BsCashCoin className="w-5 h-5 mr-2" aria-hidden="true" />
                    Transfer Nft Ownership
                  </button>
                )}
              </Menu.Item>
              {!nft.paidOut && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-red-600 text-white' : 'text-red-500'
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={handleDelete}
                    >
                      <BsTrash className="w-5 h-5 mr-2" aria-hidden="true" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <BsX className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete this nft? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NftAction
