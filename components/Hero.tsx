import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center bg-black">
      {/* Dynamic background using motion */}
      <div className="absolute inset-0 z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-400 rounded-full opacity-20"
            style={{
              width: 150,
              height: 150,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 20, -20, 0],
              y: [0, 20, -20, 0],
              scale: [1, 1.5, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 10,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center">
          <motion.h1
            className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block">Explore Unique Digital Art</span>{' '}
            <span className="block text-purple-300">NFT Marketplace</span>
          </motion.h1>
          <motion.p
            className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl lg:text-2xl md:max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover, collect, and sell extraordinary NFTs on the leading marketplace for digital
            art and collectibles.
          </motion.p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/nfts/create"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10"
              >
                Create NFT
              </Link>
            </motion.div>
            <motion.div
              className="mt-3 sm:mt-0 sm:ml-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href="/nfts"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 md:py-4 md:text-lg md:px-10"
              >
                Explore NFTs
              </Link>
            </motion.div>
          </div>
        </div>

        {/* NFT Categories */}
        <motion.div
          className="mt-12 flex flex-row justify-center flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {['Art', 'Music', 'Games', 'Collectibles'].map((category) => (
            <div key={category} className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-500 text-white">
                  {/* Placeholder for category icons */}
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-2">
                <dt className="text-sm leading-6 font-medium text-white">{category}</dt>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
