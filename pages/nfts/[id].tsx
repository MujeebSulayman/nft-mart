import { calculateDateDifference, formatDate, truncate } from '@/utils/helper'
import { NftStruct, RootState, SaleStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import Head from 'next/head'
import { BsCalendar, BsClock, BsPeople, BsGeoAlt } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import Identicon from 'react-identicons'
import Moment from 'react-moment'
import Link from 'next/link'
import BuyNft from '@/components/BuyNft'
import { getSale, getSingleNft } from '@/services/blockchain'
import NftActions from '@/components/NftAction'

interface ComponentProps {
  nftData: NftStruct
  salesData: SaleStruct[]
}

const Page: NextPage<ComponentProps> = ({ nftData, salesData }) => {
  const { address } = useAccount()
  const dispatch = useDispatch()
  const { setNft, setSales, setSaleModal } = globalActions
  const { nft, sales } = useSelector((states: RootState) => states.globalStates)
  const [countdown, setCountdown] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (nftData && salesData) {
      dispatch(setNft(nftData))
      dispatch(setSales(salesData))
    } else {
      setError('Failed to load NFT data')
    }
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

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>
  }

  if (!nft) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Head>
        <title>Nft Mart | {nft.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow container mx-auto px-4 pt-16 sm:py-24">
        <div className="rounded-xl shadow-2xl overflow-hidden mb-16">
          <div className="md:flex">
            {/* NFT Image */}
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full">
                <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-opacity-75 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                  {nft.minted ? (
                    <span className="text-green-400">Minted</span>
                  ) : (
                    <span className="text-yellow-400">Not minted</span>
                  )}
                </div>
              </div>
            </div>

            {/* NFT Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-4xl font-bold mb-4">{nft.name}</h1>
              <p className="text-gray-400 mb-6">{nft.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-indigo-400 mb-2">
                    <FaEthereum className="text-xl mr-2" />
                    <h3 className="font-semibold">Price</h3>
                  </div>
                  <p className="text-2xl font-bold">{nft.price.toFixed(3)} ETH</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-indigo-400 mb-2">
                    <BsClock className="text-xl mr-2" />
                    <h3 className="font-semibold">Time Left</h3>
                  </div>
                  <p className="text-2xl font-bold">{countdown}</p>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                {nft.endTime > Date.now() && (
                  <button
                    onClick={() => dispatch(setSaleModal('scale-100'))}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Buy NFT
                  </button>
                )}
                {address === nft.owner && <NftActions nft={nft} />}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold mb-4">Owner</h2>
                <div className="flex items-center space-x-3">
                  <Identicon className="rounded-full" size={32} string={nft.owner} />
                  <span className="font-medium">
                    {truncate({
                      text: nft.owner,
                      startChars: 4,
                      endChars: 4,
                      maxLength: 11,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
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
                <tbody className="divide-y divide-gray-700">
                  {sales.map((sale, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Identicon className="rounded-full" size={24} string={sale.owner} />
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
                        <span className="flex items-center text-indigo-400 font-semibold">
                          <FaEthereum className="mr-1" />
                          {sale.price.toFixed(3)} ETH
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        <Moment fromNow>{sale.timestamp}</Moment>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {sales.length > 10 && (
            <div className="mt-6">
              <Link
                href={'/nfts/sales/' + nft.id}
                className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All Transactions
              </Link>
            </div>
          )}
        </div>
      </main>

      <BuyNft nft={nft} />
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { id } = context.query
    const nftData: NftStruct = await getSingleNft(Number(id))
    const salesData: SaleStruct[] = await getSale(Number(id))

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
