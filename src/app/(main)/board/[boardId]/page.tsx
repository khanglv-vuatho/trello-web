'use client'

import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'

import BoardBar from '@/components/BoardBar'
import BoardContent from '@/components/BoardContent'
import { useStoreBoard, useStoreUser } from '@/store'

const BoardDetails = ({ params }: { params: { boardId: string } }) => {
  const [onFetching, setOnFetching] = useState<boolean>(false)
  const { fetchBoardDetail } = useStoreBoard()
  const board: any = useStoreBoard((state) => state.board)
  const email = useStoreUser((state) => state?.userInfo?.email) || ''

  const handleFetchingBoard = async () => {
    try {
      await fetchBoardDetail(params.boardId, email)
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
    if (!email) return
    setOnFetching(true)
  }, [email])

  if (!board || onFetching)
    return (
      <div className='flex h-[100dvh] items-center justify-center gap-2'>
        <CircularProgress aria-label='Loading...' />
        <p>Loading...</p>
      </div>
    )

  return (
    <>
      <BoardBar />
      <BoardContent />
    </>
  )
}

export default BoardDetails
