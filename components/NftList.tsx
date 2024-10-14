import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'
import { NftStruct } from '@/utils/type.dt'

const NftList: React.FC<{ nfts: NftStruct[] }> = ({ nfts }) => {
  return (
    <section className="mt-10">
      <main className="lg-w-[70%] w-full mx-auto">
        <h4 className="text-3xl font-bold text-center mt-[3rem]">All NFTs</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto w-full justify-items-center">
          {nfts.map((nft, i) => (
            <Card key={i} nft={nft} />
          ))}
        </div>
      </main>
    </section>
  )
}

const Card: React.FC<{ nft: NftStruct }> = ({ nft }) => {
  return (
    <Link
      href={'/nfts/' + nft.id}
      className="w-full max-w-sm rounded-lg shadow-md bg-gray-800 border-2 border-gray-700"
    >
      <div className="relative">
        <img src={nft.imageUrl} alt={nft.name} className="h-44 w-full object-cover" />
        {!nft.minted ? (
          <span className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-md">
            Not minted
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md">
            Minted
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 capitalize">{nft.name}</h3>
        <p className="text-gray-400 text-sm">{nft.description}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-400 text-sm">
            <FaEthereum /> {nft.price.toFixed(2)} ETH
          </p>
        </div>
      </div>
    </Link>
  )
}

export default NftList
