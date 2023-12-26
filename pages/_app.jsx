import "@/styles/index.css";
import Head from "next/head";

import * as gtag from "@/components/gtag"
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";


  import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WLXGC4B');`,
        }}
      />
      <Head>
        <title>ABPLIVE Election Centre Metaverse | Election Results 2023 LIVE | Innovation and Virtual Digital Projects by ABPLIVE</title>
        <meta name="description" content="ABPLIVE Election Centre Metaverse: Check Election Results 2023 LIVE from Madhya Pradesh, Chhattisgarh, Telangana, Rajasthan and Mizoram | Innovation and Virtual Digital Projects by ABPLIVE" />
        <meta name="keywords" content="Metaverse, ABPLIVE Metaverse, ABPLIVE Election Centre, Election results 2023, Election 2023" />
        <meta property="og:title" content="abpverse" />
        <meta property="og:image" content="https://abpverse.com/assets/images/abp-live.png" />
        <link rel="icon" type="image/png" href="/assets/images/abp-live.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
