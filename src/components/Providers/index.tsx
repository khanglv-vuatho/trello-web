'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'

import 'react-toastify/dist/ReactToastify.css'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='light'>
        {children}

        <ToastContainer />
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default Providers
