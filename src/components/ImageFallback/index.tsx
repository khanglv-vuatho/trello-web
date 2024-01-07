"use client"

import Image, { ImageProps } from "next/image"
import { useState, forwardRef, Ref } from "react"

interface ImageFallbackProps extends ImageProps {
  fallback?: string
}

const ImageFallback = forwardRef(({ src, alt, className, fallback: customFallback = "/default.webp", ...props }: ImageFallbackProps, ref: Ref<HTMLImageElement>) => {
  const [fallback, setFallback] = useState<string>("")

  const handleError = () => {
    setFallback(customFallback)
  }

  return <Image className={className} ref={ref} src={fallback || src} alt={alt} {...props} onError={handleError} />
})

ImageFallback.displayName = "Image"

export default ImageFallback
