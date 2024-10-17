import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { NftStruct } from '@/utils/type.dt'

const NftList: React.FC<{ nfts: NftStruct[] }> = ({ nfts }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="pt-32 pb-16 ">
      <main className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12">
          Explore Digital Masterpieces
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading || nfts.length === 0
            ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
            : nfts.map((nft, i) => <Card key={i} nft={nft} />)}
        </div>
      </main>
    </section>
  )
}

const Card: React.FC<{ nft: NftStruct }> = ({ nft }) => {
  return (
    <Link
      href={'/nfts/' + nft.id}
      className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
    >
      <div className="relative">
        <img src={nft.imageUrl} alt={nft.name} className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">View Details</span>
        </div>
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
          nft.minted ? 'bg-green-400' : 'bg-purple-400'
        } text-gray-900`}>
          {nft.minted ? 'Minted' : 'Not minted'}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white capitalize">{nft.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{nft.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-700 rounded-full px-3 py-1">
            <FaEthereum className="text-purple-400 mr-2" />
            <span className="text-white font-semibold">{nft.price.toFixed(2)} ETH</span>
          </div>
          <div className="text-xs text-gray-400">
            {nft.minted ? 'Owned by ' + nft.owner.slice(0, 6) + '...' + nft.owner.slice(-4) : 'Available for minting'}
          </div>
        </div>
      </div>
    </Link>
  )
}

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-72 w-full bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700 rounded-full w-24"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}

export default NftList
