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

  return nft ? (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Nft Mart | {nft.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side: Event details */}
          <div className="md:w-2/3">
            <div className="relative mb-6">
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {!nft.minted ? (
                <span className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-md">
                  Not minted
                </span>
              ) : (
                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md">
                  Minted
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{nft.name}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-4 shadow-lg">
                <div className="flex items-center text-white mb-2">
                  <BsCalendar className="text-xl mr-2" />
                  <h3 className="text-sm font-semibold">Date</h3>
                </div>
                <p className="text-white text-sm">{formatDate(nft.endTime)}</p>
              </div>

              <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-lg p-4 shadow-lg">
                <div className="flex items-center text-white mb-2">
                  <BsClock className="text-xl mr-2" />
                  <h3 className="text-sm font-semibold">Countdown</h3>
                </div>
                <p className="text-white text-sm">{countdown}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 shadow-lg">
                <div className="flex items-center text-white mb-2">
                  <FaEthereum className="text-xl mr-2" />
                  <h3 className="text-sm font-semibold">Price</h3>
                </div>
                <p className="text-white text-sm">{nft.price.toFixed(2)} ETH</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{nft.description}</p>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-2xl font-bold text-indigo-400">
                <FaEthereum className="mr-2" />
                <span>{nft.price.toFixed(2)} ETH</span>
              </div>
            </div>

            <div className="flex gap-4">
              {nft.endTime > Date.now() && (
                <button
                  onClick={() => dispatch(setSaleModal('scale-100'))}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Buy Nft
                </button>
              )}
              {address === nft.owner && <NftActions nft={nft} />}
            </div>
          </div>

          <div className="md:w-1/3 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Recent Owners ({sales.length})</h2>
            <div className="space-y-4">
              {sales.slice(0, 5).map((sale, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Identicon className="rounded-full" size={32} string={sale.owner} />
                      <span className="font-medium">
                        {truncate({
                          text: sale.owner,
                          startChars: 4,
                          endChars: 4,
                          maxLength: 11,
                        })}
                      </span>
                    </div>

                    <span className="flex items-center text-indigo-400 font-semibold">
                      {sale.price.toFixed(2)} ETH
                    </span>
                  </div>

                  <Moment fromNow className="text-sm text-gray-400">
                    {sale.timestamp}
                  </Moment>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href={'/nfts/sales/' + nft.id}
                className="block w-full text-center bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                View All Sales
              </Link>
            </div>
          </div>
        </div>
      </main>

      <BuyNft nft={nft} />
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const nftData: NftStruct = await getSingleNft(Number(id))
  const salesData: SaleStruct[] = await getSale(Number(id))

  return {
    props: {
      nftData: JSON.parse(JSON.stringify(nftData)),
      salesData: JSON.parse(JSON.stringify(salesData)),
    },
  }
}
