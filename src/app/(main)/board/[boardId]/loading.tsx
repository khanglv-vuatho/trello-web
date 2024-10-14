import React from 'react'
import { CircularProgress } from '@nextui-org/react'
const LoadingBoardDetail = () => {
  return (
    <div className='flex h-[100dvh] items-center gap-2 justify-center'>
      <CircularProgress aria-label='Loading...' />
      <p>Loading...</p>
    </div>
  )
}

export default LoadingBoardDetail
