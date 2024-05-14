'use client'

import Script from 'next/script'

const AdSense = ({ pId }: { pId: string }) => {
  return <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`} crossOrigin='anonymous' />
}

export default AdSense
