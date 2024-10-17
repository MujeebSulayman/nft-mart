import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEdit, FiDollarSign, FiCodesandbox, FiSend, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { NftStruct } from '@/utils/type.dt'
import { useRouter } from 'next/router'
import { deleteNft, mintNft, payout, transferOwnership } from '@/services/blockchain'

const NftAction: React.FC<{ nft: NftStruct }> = ({ nft }) => {
  const { address } = useAccount()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [newOwnerAddress, setNewOwnerAddress] = useState('')

  const handlePayout = async () => {
    if (!address) return toast.warn('Connect wallet first')
    await toast.promise(
      payout(nft.id),
      {
        pending: 'Processing payout...',
        success: 'Payout successful!',
        error: 'Payout failed',
      }
    )
    router.push(`/nfts/${nft.id}`)
  }

  const handleMint = async () => {
    if (!address) return toast.warn('Connect wallet first')
    await toast.promise(
      mintNft(nft.id),
      {
        pending: 'Minting NFT...',
        success: 'NFT minted successfully!',
        error: 'Minting failed',
      }
    )
    router.push(`/nfts/${nft.id}`)
  }

  const handleDelete = async () => {
    if (!address) return toast.warn('Connect wallet first')
    await toast.promise(
      deleteNft(nft.id),
      {
        pending: 'Deleting NFT...',
        success: 'NFT deleted successfully!',
        error: 'Deletion failed',
      }
    )
    router.push('/')
  }

  const handleTransfer = async () => {
    if (!address) return toast.warn('Connect wallet first')
    if (!newOwnerAddress) return toast.warn('Please enter a valid address')
    await toast.promise(
      transferOwnership(nft.id, newOwnerAddress),
      {
        pending: 'Transferring ownership...',
        success: 'Ownership transferred successfully!',
        error: 'Transfer failed',
      }
    )
    setIsTransferModalOpen(false)
    setNewOwnerAddress('')
    router.push(`/nfts/${nft.id}`)
  }

  const ActionButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; color: string }> = ({ icon, text, onClick, color }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center w-full p-3 rounded-lg ${color} text-white font-medium`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </motion.button>
  )

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
        onClick={() => setIsModalOpen(true)}
      >
        Manage NFT
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Manage NFT</h2>
              <div className="space-y-3">
                <ActionButton
                  icon={<FiEdit />}
                  text="Edit NFT"
                  onClick={() => router.push(`/nfts/edit/${nft.id}`)}
                  color="bg-blue-500 hover:bg-blue-600"
                />
                <ActionButton
                  icon={<FiDollarSign />}
                  text="Payout"
                  onClick={handlePayout}
                  color="bg-green-500 hover:bg-green-600"
                />
                <ActionButton
                  icon={<FiCodesandbox />}
                  text="Mint NFT"
                  onClick={handleMint}
                  color="bg-purple-500 hover:bg-purple-600"
                />
                <ActionButton
                  icon={<FiSend />}
                  text="Transfer Ownership"
                  onClick={() => setIsTransferModalOpen(true)}
                  color="bg-indigo-500 hover:bg-indigo-600"
                />
                {!nft.paidOut && (
                  <ActionButton
                    icon={<FiTrash2 />}
                    text="Delete NFT"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    color="bg-red-500 hover:bg-red-600"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete this NFT? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Transfer NFT Ownership</h2>
              <input
                type="text"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                placeholder="Enter new owner's address"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setIsTransferModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                  onClick={handleTransfer}
                >
                  Transfer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default NftAction
