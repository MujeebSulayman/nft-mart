import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { NftStruct } from '@/utils/type.dt'
import { motion } from 'framer-motion';

const NftList: React.FC<{ nfts: NftStruct[] }> = ({ nfts }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="pt-24 pb-16">
      <main className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-12"
        >
          Explore Digital Masterpieces
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {loading || nfts.length === 0
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : nfts.map((nft, i) => <Card key={i} nft={nft} />)}
        </motion.div>
      </main>
    </section>
  )
}

const Card: React.FC<{ nft: NftStruct }> = ({ nft }) => {
  return (
    <Link href={'/nfts/' + nft.id}>

    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-700/50"
    >
      
      <div className="relative group">
        <img src={nft.imageUrl} alt={nft.name} className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-purple-900 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-900 px-4 py-2 rounded-full font-semibold text-sm"
          >
            View Details
          </motion.button>
        </div>
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-sm font-semibold ${
          nft.minted ? 'bg-green-400' : 'bg-purple-400'
        } text-gray-900 shadow-md`}>
          {nft.minted ? 'Minted' : 'Not minted'}
        </span>
      </div>

      <div className="p-4 pt-8 pb-8">
        <h3 className="text-lg font-bold mb-2 text-white capitalize truncate">{nft.name}</h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{nft.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 bg-gradient-to-r rounded-full px-3 py-1"
          >
            <FaEthereum className="text-white text-sm" />
            <span className="text-white font-bold text-sm">{nft.price.toFixed(4)} ETH</span>
          </motion.div>
          <div className="text-sm text-gray-400 bg-purple-900/50 rounded-full px-2 py-1 backdrop-blur-sm">
            {nft.minted ? 'Owned by ' + nft.owner.slice(0, 4) + '...' + nft.owner.slice(-4) : 'Available'}
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={'/nfts/' + nft.id}
            className="block w-full text-center bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
          >
            <span>View Details</span>
            <HiOutlineExternalLink className="text-base" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
    </Link>
  )
}

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg border border-purple-700/50">
      <div className="relative">
        <div className="h-60 w-full bg-purple-900/30 animate-pulse"></div>
        <div className="absolute top-3 right-3 w-16 h-6 bg-purple-600/50 rounded-full animate-pulse"></div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-purple-900/30 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-purple-900/30 rounded w-full mb-1 animate-pulse"></div>
        <div className="h-4 bg-purple-900/30 rounded w-2/3 mb-3 animate-pulse"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-7 bg-purple-600/50 rounded-full w-24 animate-pulse"></div>
          <div className="h-6 bg-purple-900/30 rounded-full w-1/3 animate-pulse"></div>
        </div>
        <div className="h-9 bg-purple-600/50 rounded-lg w-full animate-pulse"></div>
      </div>
    </div>
  )
}

export default NftList
