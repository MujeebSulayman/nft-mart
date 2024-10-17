import Sales from '@/components/Sales'
import { getAllSales } from '@/services/blockchain'
import { SaleStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SalesPage: NextPage<{ salesData: SaleStruct[] }> = ({ salesData }) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>Nft Mart | Nft Transactions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Nft Transactions</h1>

        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <Sales sales={salesData} />
        </section>

        <div className="flex justify-start">
          <Link
            href={'/nfts/' + id}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md
            hover:bg-blue-700 transition duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Back to Nft
          </Link>
        </div>
      </main>
    </div>
  )
}

export default SalesPage

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const salesData: SaleStruct[] = await getAllSales(Number(id))

  return {
    props: {
      salesData: JSON.parse(JSON.stringify(salesData)),
    },
  }
}
