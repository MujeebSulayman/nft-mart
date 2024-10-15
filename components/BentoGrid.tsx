import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaEthereum, FaUsers, FaImage, FaGem, FaShoppingCart } from 'react-icons/fa'

const BentoGrid = () => {
  return (
    <div className="container mx-auto px-4 py-16 mt-20 text-white">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Large feature item */}
        <motion.div
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-8 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold mb-4">Discover Rare NFTs</h2>
          <p className="mb-6 text-gray-200">
            Explore unique digital artworks and collectibles on our NFT marketplace.
          </p>
          <motion.button
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Collecting
          </motion.button>
        </motion.div>

        {/* Featured Collection */}
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaGem className="text-4xl text-yellow-300 mb-4" />
          <h3 className="text-xl font-semibold mb-3">Featured Collection</h3>
          <p className="text-2xl font-bold text-yellow-300">Nft Mart</p>
          <p className="text-gray-200">10,000 unique collectibles</p>
        </motion.div>

        {/* NFT showcase */}
        

        {/* Marketplace stats */}
        <motion.div
          className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaShoppingCart className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-3">Marketplace Activity</h3>
          <p className="text-4xl font-bold">1.2M+</p>
          <p>NFTs Traded</p>
        </motion.div>

        {/* Create NFT */}
        <motion.div
          className="bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaImage className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-3">Create Your NFT</h3>
          <p className="text-gray-200">
            Turn your digital creations into valuable NFTs and sell them on our marketplace.
          </p>
          <motion.button
            className="mt-4 bg-white text-red-500 px-4 py-2 rounded-full font-semibold hover:bg-opacity-90 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Creating
          </motion.button>
        </motion.div>

        {/* Community */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaUsers className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-3">NFT Community</h3>
          <p className="text-gray-200">
            Join our vibrant community of NFT creators, collectors, and enthusiasts.
          </p>
          <p className="mt-4 font-semibold">100,000+ members</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BentoGrid

