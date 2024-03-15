'use client'

import BoardBar from '@/components/BoardBar'
import BoardContent from '@/components/BoardContent'
import Header from '@/(layout)/Header'
import { mockData } from './constants'
import { useEffect, useState } from 'react'
import { IBoard } from '@/interface'
import instance from '@/services/axiosConfig'

export default function Home() {
  const [board, setBoard] = useState<any>({})
  const [onFetching, setOnFetching] = useState<boolean>(false)

  const handleFetchingBoard = async () => {
    try {
      const { data }: any = instance.get(`/v1/boards/65f327f4ae31059fa712f364`)
      console.log({ data })
      setBoard(data)
    } catch (error) {
      console.log(error)
    } finally {
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
      <BoardBar board={board} />
      <BoardContent board={board} />
    </>
  )
}
