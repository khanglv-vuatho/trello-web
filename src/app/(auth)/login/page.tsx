'use client'

import ImageFallback from '@/components/ImageFallback'
import Toast from '@/components/Toast'
import { Button } from '@nextui-org/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'

const Login = () => {
  const router = useRouter()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse) {
        localStorage.setItem('access_token', tokenResponse.access_token)

        Toast({
          message: 'Login Successful',
          type: 'success',
        })
        router.push('/')
      }
    },
    onError: () => {
      Toast({
        message: 'Login Failed',
        type: 'error',
      })
    },
  })

  return (
    <div className='relative w-full min-h-screen max-h-dvh flex items-center justify-center'>
      <ImageFallback src={'/login/background.png'} alt='background' height={4000} width={4000} className='absolute inset-0 object-cover -z-10 max-h-dvh' />
      <form className='flex min-w-[400px] flex-col gap-6 items-center justify-center bg-transparent border-1 border-white py-10 px-4 rounded-2xl shadow-lg backdrop-blur-sm'>
        <h1 className='text-white text-4xl'>Login</h1>
        <Button className='py-2 w-full text-lg' onClick={() => login()}>
          Sign in with Google 🚀
        </Button>
      </form>
    </div>
  )
}

export default Login
