import { decodeEmail } from '@/utils'
import { Avatar, Button, Input } from '@nextui-org/react'
import React from 'react'

const ProfilePage = ({ params }: { params: { id: string } }) => {
  console.log(decodeEmail(params.id))
  return (
    <div className='flex size-full flex-col gap-4 p-4'>
      <h1 className='text-2xl font-bold'>Edit Profile</h1>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-10'>
        <div className='flex flex-col items-center gap-4'>
          <Avatar src='https://source.unsplash.com/random/80x80' className='flex !size-60 flex-shrink-0' />
          <Button className='w-fit rounded-full bg-colorBoardBar py-3 text-white'>Change Avatar</Button>
        </div>
        <div className='flex flex-col gap-4'>
          <Input readOnly label='Display Name' labelPlacement='outside' value='John Doe' />
          <Input readOnly label='Email' labelPlacement='outside' value='example@example.com' />

          <Button className='ml-auto mt-10 w-fit bg-colorBoardBar py-3 text-white'>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
