import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { NftParams } from '@/utils/type.dt'
import { createNft } from '@/services/blockchain'
import { toast } from 'react-toastify'
import Head from 'next/head'
import CreateNftSkeleton from '@/components/CreateNftSkeleton'

const Page: NextPage = () => {
  const { address } = useAccount()
  const [loading, setLoading] = useState(true)
  const [nft, setNft] = useState<NftParams>({
    name: '',
    description: '',
    imageUrl: '',
    endTime: '',
    price: '',
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNft((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!address) return toast.warn('Please connect your wallet')

    nft.endTime = new Date(nft.endTime).getTime()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        createNft(nft)
          .then((tx) => {
            console.log(tx)
            resetForm()
            resolve(tx)
          })
          .catch((error) => {
            reject(error)
          })
      }),
      {
        pending: 'Creating NFT...',
        success: 'NFT created successfully',
        error: 'Failed to create NFT',
      }
    )
  }

  const resetForm = () => {
    setNft({
      name: '',
      description: '',
      imageUrl: '',
      endTime: '',
      price: '',
    })
  }

  const inputClasses =
    'mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out'

  if (loading) {
    return <CreateNftSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br text-gray-300">
      <Head>
        <title>Nft mart | List Nft</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-6">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center pt-[5rem]">
          List New Nft
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl"
        >
          {nft.imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="h-48 w-full object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Nft Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={inputClasses}
                placeholder="Enter Nft Name"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-400 mb-1">
                Nft Image Url
              </label>
              <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                className={inputClasses}
                placeholder="https://example.com/image.jpg"
                pattern="https?://.+(\.(jpg|png|gif))?$"
                value={nft.imageUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="endsAt" className="block text-sm font-medium text-gray-400 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  id="endTime"
                  className={inputClasses}
                  placeholder="Enter"
                  value={nft.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="endsAt" className="block text-sm font-medium text-gray-400 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  aria-placeholder="0.1"
                  min="0.001"
                  step="0.001"
                  className={inputClasses}
                  placeholder="Enter Price"
                  value={nft.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className={inputClasses}
                placeholder="Describe your Nft"
                value={nft.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-150 ease-in-out"
            >
              Upload Nft
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page
