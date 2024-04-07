'use client'

import Header from '@/(layout)/Header'
import BoardBar from '@/components/BoardBar'
import BoardContent from '@/components/BoardContent'
import { useStoreBoard } from '@/store'
import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [onFetching, setOnFetching] = useState<boolean>(false)
  const { fetchBoard } = useStoreBoard()
  const board: any = useStoreBoard((state) => state.board)
  const handleFetchingBoard = async () => {
    try {
      await fetchBoard('660ad0e171158d225fd8def9')
      setOnFetching(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    onFetching && handleFetchingBoard()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [board])

  if (!board)
    return (
      <div className='flex h-[100dvh] items-center gap-2 justify-center'>
        <CircularProgress aria-label='Loading...' />
        <p>Loading...</p>
      </div>
    )

  return (
    <>
      <Header />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </>
  )
}
