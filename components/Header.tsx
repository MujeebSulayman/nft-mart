import Link from 'next/link'
import ConnectBtn from './ConnectBtn'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CgMenuLeft } from 'react-icons/cg'
import { FaTimes } from 'react-icons/fa'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed z-50 top-0 right-0 left-0 transition-all duration-300 ${
        scrolled ? 'bg-black bg-opacity-20 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href={'/'} className="text-xl font-bold text-white">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                NFT Mart
              </motion.span>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open menu</span>
              <CgMenuLeft className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>
          <nav className="hidden md:flex space-x-10">
            <NavLink href="/explore">Explore</NavLink>
            <NavLink href="/nfts">All Nfts</NavLink>
            <NavLink href="nfts/create">Create</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <ConnectBtn networks />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-gray-900 divide-y-2 divide-gray-800">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={'/'} className="text-xl font-bold text-white">
                      NFT Mart
                    </Link>
                  </div>
                  <div className="-mr-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(!isOpen)}
                      className="bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                      <span className="sr-only">Close menu</span>
                      <FaTimes className="h-6 w-6" aria-hidden="true" />
                    </motion.button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    <NavLink href="/nfts" mobile>
                      Explore
                    </NavLink>
                    <NavLink href="/nfts/create" mobile>
                      Create
                    </NavLink>
                    <NavLink href="/about" mobile>
                      About
                    </NavLink>
                    <NavLink href="/contact" mobile>
                      Contact
                    </NavLink>
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <ConnectBtn />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

const NavLink: React.FC<{ href: string; children: React.ReactNode; mobile?: boolean }> = ({
  href,
  children,
  mobile,
}) => (
  <Link href={href} passHref legacyBehavior>
    <motion.span
      className={`text-base font-medium text-gray-300 hover:text-white cursor-pointer ${
        mobile ? 'block' : ''
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  </Link>
)

export default Header
