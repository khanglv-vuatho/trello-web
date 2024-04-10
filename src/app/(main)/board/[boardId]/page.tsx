'use client'

import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { currentUser } from '@clerk/nextjs'

import Header from '@/(layout)/Header'
import BoardBar from '@/components/BoardBar'
import BoardContent from '@/components/BoardContent'
import { useStoreBoard } from '@/store'

const BoardDetails = ({ params }: { params: { boardId: string } }) => {
  const [onFetching, setOnFetching] = useState<boolean>(false)
  const { fetchBoard } = useStoreBoard()
  const board: any = useStoreBoard((state) => state.board)
  const handleFetchingBoard = async () => {
    try {
      await fetchBoard(params.boardId)
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await currentUser()

        console.log({ user })
        // Do something with user data if needed
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  if (!board)
    return (
      <div className='flex h-[100dvh] items-center gap-2 justify-center'>
        <CircularProgress aria-label='Loading...' />
        <p>Loading...</p>
      </div>
    )

  return (
    <>
      <BoardBar board={board} />
      <BoardContent board={board} />
    </>
  )
}

export default BoardDetails
