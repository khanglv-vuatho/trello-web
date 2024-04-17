'use client'
import Toast from '@/components/Toast'
import { Button } from '@nextui-org/react'
import { GoogleLogin, TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { redirect, useRouter } from 'next/navigation'

const Login = () => {
  const router = useRouter()
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
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
  return <Button onClick={() => login()}>Sign in with Google 🚀</Button>
}

export default Login
