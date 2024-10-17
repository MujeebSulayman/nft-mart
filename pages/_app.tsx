import { ToastContainer } from 'react-toastify'
import '@/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import { Providers } from '@/services/provider'
import type { AppProps } from 'next/app'
import Header from '@/components/Header'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState<boolean>(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild || typeof window === 'undefined') {
    return null
  } else {
    return (
      <Providers pageProps={pageProps}>
        <Provider store={store}>
          <div className="bg-black min-h-screen flex flex-col text-white">
            <Header />

            <Component {...pageProps} />

            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <footer className="text-center py-20 text-gray-400 text-sm">
              © 2024 Nft Mart. All rights reserved || Abdulmujeeb Sulayman.
            </footer>
          </div>
        </Provider>
      </Providers>
    )
  }
}
