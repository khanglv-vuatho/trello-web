'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import 'react-toastify/dist/ReactToastify.css'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='light'>
        {children}
        <ProgressBar height='4px' color='#fff' options={{ showSpinner: true }} shallowRouting />
        <ToastContainer />
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default Providers
