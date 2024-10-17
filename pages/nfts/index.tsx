import NftList from '@/components/NftList'
import { getAllNfts } from '@/services/blockchain'
import { NftStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

const AllNftsPage: NextPage = () => {
  const [end, setEnd] = useState<number>(12)
  const [count] = useState<number>(12)
  const [nfts, setNfts] = useState<NftStruct[]>([])
  const [collection, setCollection] = useState<NftStruct[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedNfts: NftStruct[] = await getAllNfts()
      setNfts(fetchedNfts)
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCollection(nfts.slice(0, end))
  }, [nfts, end])

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>Nft Mart | All Nfts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

export default AllNftsPage
