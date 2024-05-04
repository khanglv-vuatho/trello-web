'use client'

import { useRouter } from 'next/navigation'
import { MainPage } from '.'
import { useEffect, useState } from 'react'

const Page = () => {
  const [token, setToken] = useState<string | null>()

  const router = useRouter()

  useEffect(() => {
    setToken(localStorage.getItem('access_token'))
  }, [token])

  return <MainPage />
}

export default Page
