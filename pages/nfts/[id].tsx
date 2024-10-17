import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux'
import { FaEthereum, FaUser, FaCopy, FaClock } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Moment from 'react-moment'

import { NftStruct, RootState, SaleStruct } from '@/utils/type.dt'
import { globalActions } from '@/store/globalSlices'
import { calculateDateDifference, truncate } from '@/utils/helper'
import { getAllSales, getSingleNft } from '@/services/blockchain'
import BuyNft from '@/components/BuyNft'
import NftActions from '@/components/NftAction'

interface ComponentProps {
  nftData: NftStruct
  salesData: SaleStruct[]
}

const NftDetailsPage: NextPage<ComponentProps> = ({ nftData, salesData }) => {
  const { address } = useAccount()
  const dispatch = useDispatch()
  const { setNft, setSales, setSaleModal } = globalActions
  const { nft, sales } = useSelector((states: RootState) => states.globalStates)
  const [countdown, setCountdown] = useState('')
  const [showNftActions, setShowNftActions] = useState(false)

  useEffect(() => {
    dispatch(setNft(nftData))
    dispatch(setSales(salesData))
  }, [dispatch, setNft, nftData, setSales, salesData])

  useEffect(() => {
    const timer = setInterval(() => {
      if (nft) {
        const timeLeft = calculateDateDifference(nft.endTime, Date.now())
        setCountdown(timeLeft)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [nft])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Address copied to clipboard!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  if (!nft) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <Head>
        <title>NFT Details | {nft.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 pt-[10%] pb-8">
        <div className="rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <img
                src={nft.imageUrl}
                alt={nft.name}
                width={400}
                height={400}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-4xl font-bold mb-4">{nft.name}</h1>
              <p className="text-gray-400 mb-6">{nft.description}</p>

              <div className=" grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Price</span>
                    <FaEthereum className="text-xl text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold">{nft.price.toFixed(4)} ETH</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Owner</span>
                    <FaUser className="text-xl text-purple-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">
                      {truncate({
                        text: nft.owner,
                        startChars: 4,
                        endChars: 4,
                        maxLength: 11,
                      })}
                    </p>
                    <button
                      onClick={() => copyToClipboard(nft.owner)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-300">Time Remaining</span>
                  <FaClock className="text-xl text-purple-400" />
                </div>
                <div className="">
                  {countdown.split(':').map((value, index) => (
                    <div key={index} className="rounded-lg p-2 text-center">
                      <div className="text-xl font-bold">{value.padStart(2, '0')}</div>
                      <div className="text-xs text-gray-400">
                        {['Days', 'Hours', 'Minutes', 'Seconds'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {(address !== nft.owner || !address) && nft.endTime > Date.now() && (
                  <button
                    onClick={() => dispatch(setSaleModal('scale-100'))}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors mb-4"
                  >
                    Buy NFT
                  </button>
                )}
                {address === nft.owner && (
                  <div className="space-y-4">
                    <NftActions nft={nft} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
          <div className="rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {sales.map((sale, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">
                            {truncate({
                              text: sale.owner,
                              startChars: 4,
                              endChars: 4,
                              maxLength: 11,
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center text-purple-400 font-semibold">
                          <FaEthereum className="mr-1" />
                          {sale.price.toFixed(4)} ETH
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <Moment fromNow>{sale.timestamp}</Moment>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <BuyNft nft={nft} />
    </div>
  )
}

export default NftDetailsPage

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { id } = context.query
    const nftData: NftStruct = await getSingleNft(Number(id))
    const salesData: SaleStruct[] = await getAllSales(Number(id))

    return {
      props: {
        nftData: JSON.parse(JSON.stringify(nftData)),
        salesData: JSON.parse(JSON.stringify(salesData)),
      },
    }
  } catch (error) {
    console.error('Error fetching NFT data:', error)
    return {
      props: {
        nftData: null,
        salesData: [],
      },
    }
  }
}
