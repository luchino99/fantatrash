import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Disattiva il caricamento della favicon */}
        <link rel="icon" href="data:," />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
