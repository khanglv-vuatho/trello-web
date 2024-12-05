'use client'

import WrapperLayout from '@/components/WrapperLayout'
import { NOTIFICATION_TYPES } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { Button } from '@nextui-org/react'
import { TickCircle } from 'iconsax-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const AcceptInvitation = ({ searchParams }: { searchParams: { boardId: string; status: string } }) => {
  const { boardId } = searchParams
  const [onAccept, setOnAccept] = useState(false)
  const { userInfo } = useStoreUser()
  const currentLink = window.location.href

  localStorage.setItem('accept-invitation-link', currentLink)
  // get full current link

  const handleAcceptInvitation = async () => {
    try {
      await instance.put(`/v1/notifications/${boardId}`, { status: NOTIFICATION_TYPES.ACCEPTED, email: userInfo?.email, boardId })
      localStorage.removeItem('accept-invitation-link')
    } catch (error) {
      console.log({ error })
    } finally {
      setOnAccept(false)
      // redirect to home page
      //   router.push(`/board/${boardId}`)
    }
  }
  useEffect(() => {
    if (!userInfo?.email) return
    if (!searchParams.status || !boardId) return
    if (searchParams.status === NOTIFICATION_TYPES.ACCEPTED) {
      setOnAccept(true)
    }
  }, [searchParams.status, boardId, userInfo?.email])

  useEffect(() => {
    onAccept && handleAcceptInvitation()
  }, [onAccept])

  return (
    <WrapperLayout>
      <div className='mx-4 w-full max-w-md rounded-lg border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10'>
        <div className='flex flex-col items-center space-y-4 pb-2'>
          <TickCircle variant='Bold' className='h-6 w-6 text-green-500' />
          <h1 className='text-center text-2xl font-bold'>Invitation Accepted!</h1>
        </div>
        <div className='space-y-4'>
          <div className='rounded-lg bg-white/20 p-4'>
            <div className='space-y-3'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Board ID</p>
                <p className='break-all font-mono text-sm'>6746c5d71291dcf337ee97a6</p>
              </div>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Status</p>
                <div className='flex items-center space-x-2'>
                  <div className='size-2 min-h-2 min-w-2 rounded-full bg-green-500' />
                  <p className='text-sm font-medium'>Accepted</p>
                </div>
              </div>
            </div>
          </div>
          <p className='text-muted-foreground text-center text-sm'>You now have access to the shared board. You can start collaborating with your team immediately.</p>
        </div>
        <div className='mt-4 flex flex-col space-y-2'>
          <Button as={Link} href={`/board/${boardId}`} className='min-h-10 w-full bg-[#3843D0] text-white hover:bg-[#3843D0]/90' size='lg'>
            Go to Board
          </Button>
          <Button as={Link} href='/' className='text-muted-foreground min-h-10 w-full text-center text-sm text-black transition-colors hover:text-[#3843D0]'>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </WrapperLayout>
  )
}

export default AcceptInvitation
