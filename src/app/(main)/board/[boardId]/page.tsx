'use client'

import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'

import BoardBar from '@/components/BoardBar/BoardBar'
import { useStoreBoard, useStoreUser } from '@/store'
import BoardContent from '@/components/BoardContent'
import { useRouter } from 'next/navigation'

const BoardDetails = ({ params }: { params: { boardId: string } }) => {
  const [onFetching, setOnFetching] = useState<boolean>(false)
  const { fetchBoardDetail, board, fetchAllBoards, boardsRecent, boardsStar } = useStoreBoard()
  const email = useStoreUser((state) => state?.userInfo?.email) || ''
  const router = useRouter()

  const handleFetchingBoard = async () => {
    try {
      await fetchBoardDetail(params.boardId, email)
      if (boardsRecent !== undefined && boardsStar !== undefined) return

      await fetchAllBoards(email)
    } catch (error) {
      console.log(error)
      router.push('/board-not-found')
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
