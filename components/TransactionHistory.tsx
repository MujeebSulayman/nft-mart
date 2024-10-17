import React from 'react'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import Moment from 'react-moment'
import { SaleStruct } from '@/utils/type.dt'
import { truncate } from '@/utils/helper'
import { toast } from 'react-toastify'

interface TransactionHistoryProps {
  sales: SaleStruct[]
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ sales }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Address copied to clipboard!', {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
        toast.error('Failed to copy address', {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-white">Transaction History</h2>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {sales.map((sale, i) => (
                <tr key={i} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className=" text-gray-500">{sale.owner}</span>
                      <button
                        onClick={() => copyToClipboard(sale.owner)}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        title="Copy full address"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center text-green-400 font-semibold">
                      <FaEthereum className="mr-1" />
                      {sale.price.toFixed(4)} ETH
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    <Moment fromNow>{sale.timestamp}</Moment>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
