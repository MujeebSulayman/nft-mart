import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaEthereum, FaUsers, FaChartLine } from 'react-icons/fa'

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
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold mb-4">Decentralized Future</h2>
          <p className="mb-6 text-gray-200">
            Explore the limitless possibilities of Web3 technology and join the revolution.
          </p>
          <motion.button
            className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Ethereum stats */}
        <motion.div
          className="bg-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaEthereum className="text-4xl text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold mb-3">Ethereum Network</h3>
          <p className="text-4xl font-bold text-indigo-400">2,345 TPS</p>
          <p className="text-gray-400">Transactions per second</p>
        </motion.div>

        {/* NFT showcase */}
        <motion.div
          className="bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold mb-3">NFT Showcase</h3>
          <p className="text-gray-100">
            Discover unique digital assets and join the NFT revolution.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative h-20 rounded-lg overflow-hidden">
                <Image
                  src={`/images/nft${i}.jpg`}
                  alt={`NFT ${i}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* DeFi stats */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-teal-400 text-white rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaChartLine className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-3">DeFi Growth</h3>
          <p className="text-4xl font-bold">$75B+</p>
          <p>Total Value Locked</p>
        </motion.div>

        {/* Community */}
        <motion.div
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <FaUsers className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-3">Join Our Community</h3>
          <p className="text-gray-800">
            Connect with like-minded individuals and shape the future of Web3.
          </p>
          <p className="mt-4 font-semibold">50,000+ members</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BentoGrid
