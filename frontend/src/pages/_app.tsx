import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Workation — Travel Package Price Predictor</title>
        <meta name="description" content="AI-powered travel package price prediction platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-mist">
        <Component {...pageProps} />
      </main>
    </>
  );
}
