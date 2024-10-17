import NftList from '@/components/NftList'
import { getMyNfts } from '@/services/blockchain'
import { NftStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

const Page: NextPage = () => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(6)
  const [collection, setCollection] = useState<NftStruct[]>([])
  const [nfts, setNfts] = useState<NftStruct[]>([])

  useEffect(() => {
    setCollection(nfts.slice(0, 12))
  }, [end, nfts])

  useEffect(() => {
    const fetchdata = async () => {
      const nfts: NftStruct[] = await getMyNfts()
      setNfts(nfts)
    }
    fetchdata()
  }, [])

  return (
    <div>
      <Head>
        <title>Nft Mart | My Nfts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NftList nfts={collection} />

      <div className="mt-10 h-20 "></div>

      <main className="container mx-auto px-4 py-8">
        <NftList nfts={collection} />
        {collection.length > 0 && nfts.length > collection.length && (
          <div className="w-full flex justify-center items-center mt-10">
            <button
              className="px-6 py-3 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 duration-300 transition-all"
              onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Page
