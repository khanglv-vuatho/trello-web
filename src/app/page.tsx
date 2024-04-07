'use client'

import Header from '@/(layout)/Header'
import BoardBar from '@/components/BoardBar'
import BoardContent from '@/components/BoardContent'
import { useStoreBoard } from '@/store'
import { useEffect, useState } from 'react'

export default function Home() {
  const [onFetching, setOnFetching] = useState<boolean>(false)
  const { fetchBoard } = useStoreBoard()
  const board: any = useStoreBoard((state) => state.board)
  const handleFetchingBoard = async () => {
    try {
      await fetchBoard('660ad0e171158d225fd8def9')
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

  return (
    <>
      <Header />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </>
  )
}
