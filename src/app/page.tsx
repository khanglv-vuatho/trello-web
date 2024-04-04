'use client'

import BoardBar from '@/components/BoardBar'
import BoardContent from '@/components/BoardContent'
import Header from '@/(layout)/Header'
import { mockData } from './constants'
import { useEffect, useState } from 'react'
import { IBoard } from '@/types'
import instance from '@/services/axiosConfig'

export default function Home() {
  const [board, setBoard] = useState<any>({})
  const [onFetching, setOnFetching] = useState<boolean>(false)

  const handleFetchingBoard = async () => {
    try {
      const data: any = await instance.get(`/v1/boards/660ad3627613c6b26e1e762d`)

      setBoard(data)
    } catch (error) {
      console.log(error)
      setOnFetching(false)
    }
  }

  useEffect(() => {
    onFetching && handleFetchingBoard()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  return (
    <>
      <Header />
      <BoardBar board={mockData.board} />
      <BoardContent board={mockData.board} />
    </>
  )
}
