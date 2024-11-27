import React from 'react'

const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-boardContainer items-center justify-center bg-colorBoardContent'>
      <div className='ct-container flex w-full justify-center py-10 text-white'>{children}</div>
    </div>
  )
}

export default WrapperLayout
