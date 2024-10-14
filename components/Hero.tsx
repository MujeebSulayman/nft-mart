import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaEthereum } from 'react-icons/fa'

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bubbles: Bubble[] = []
    const bubbleCount = 25 // Reduced from 50

    class Bubble {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      constructor() {
        if (!canvas) {
          throw new Error('Canvas is not initialized')
        }
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 9 + 1 // Reduced size range
        this.speedX = Math.random() * 0.5 - 0.25 // Reduced speed range
        this.speedY = Math.random() * 0.5 - 0.25 // Reduced speed range
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        // Gentle bounce off edges
        if (canvas && (this.x + this.size > canvas.width || this.x - this.size < 0)) {
          this.speedX *= -0.5 // Reduce speed after bouncing
        }
        if (canvas && (this.y + this.size > canvas.height || this.y - this.size < 0)) {
          this.speedY *= -0.5 // Reduce speed after bouncing
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)' // Reduced opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      bubbles.forEach((bubble) => {
        bubble.update()
        bubble.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative bg-black pt-[5rem] text-purple-100 min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mt-12 md:mt-24">
          <div className="text-left w-full md:w-1/2 md:pr-8">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Discover, Collect, and Sell <span className="text-purple-500">Extraordinary</span>{' '}
              NFTs
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl mb-6 md:mb-10 max-w-xl text-purple-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              CryptoCanvas is the world's leading NFT marketplace. Explore, trade, and create unique
              digital assets on the blockchain.
            </motion.p>
            <motion.div
              className="flex space-x-4 md:space-x-6 mb-8 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button className="bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-2 md:py-3 rounded-lg text-base md:text-lg font-semibold text-white transition-colors">
                Explore
              </button>
              <button className="bg-transparent border-2 border-purple-400 text-purple-400 px-6 md:px-8 py-2 md:py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-purple-400 hover:text-white transition-colors">
                Create
              </button>
            </motion.div>
            <div className="flex space-x-4 md:space-x-8">
              <div className="text-center backdrop-blur-md bg-purple-900/30 rounded-lg shadow-lg p-3 md:p-4">
                <p className="font-bold text-2xl md:text-3xl text-purple-300">100K+</p>
                <p className="text-sm md:text-base text-purple-200">Artworks</p>
              </div>
              <div className="text-center backdrop-blur-md bg-purple-900/30 rounded-lg shadow-lg p-3 md:p-4">
                <p className="font-bold text-2xl md:text-3xl text-purple-300">50K+</p>
                <p className="text-sm md:text-base text-purple-200">Artists</p>
              </div>
              <div className="text-center backdrop-blur-md bg-purple-900/30 rounded-lg shadow-lg p-3 md:p-4">
                <p className="font-bold text-2xl md:text-3xl text-purple-300">300K+</p>
                <p className="text-sm md:text-base text-purple-200">Collectors</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
            <motion.div
              className="bg-gradient-to-br from-purple-900 to-blue-900 p-4 rounded-3xl shadow-lg overflow-hidden w-full max-w-md relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </div>
              <img
                src="/MURAKAMI.png"
                alt="TAKASHI MURAKAMI"
                className="w-full h-72 object-cover rounded-2xl mb-4"
              />
              <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">TAKASHI MURAKAMI</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300 text-sm">Price</p>
                  <div className="flex items-center space-x-1">
                    <FaEthereum className="w-4 h-4 " />
                    <p className="text-white font-bold">0.55</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                    <p className="text-sm text-gray-300">@TheHemjay</p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors">
                    Place Bid
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
