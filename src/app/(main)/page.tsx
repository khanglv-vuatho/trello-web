'use client'

import { useRouter } from 'next/navigation'
import { MainPage } from './index'

const Page = () => {
  const token = localStorage?.getItem('access_token')
  const router = useRouter()

  if (!token) {
    router.push('/login')
  } else {
    return <MainPage />
  }
}

export default Page
