import BentoGrid from '@/components/BentoGrid'
import Hero from '@/components/Hero'
import NftList from '@/components/NftList'
import { getAllNfts } from '@/services/blockchain'
import { NftStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const Page: NextPage = () => {
  const [nfts, setNfts] = useState<NftStruct[]>([])
  const [collection, setCollection] = useState<NftStruct[]>([])
  const [end, setEnd] = useState<number>(12)
  const [count] = useState<number>(12)

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const fetchedNfts = await getAllNfts()
        setNfts(fetchedNfts)
        console.log('Fetched NFTs:', fetchedNfts)
      } catch (error) {
        console.error('Failed to fetch NFTs', error)
        if (error instanceof Error) {
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        setNfts([])
      }
    }
    fetchNfts()
  }, [])

  useEffect(() => {
    setCollection(nfts.slice(0, end))
  }, [nfts, end])

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Head>
        <title>NFT Mart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

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
      <BentoGrid />
    </div>
  )
}

export default Page
