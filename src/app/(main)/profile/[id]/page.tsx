'use client'
import ImageFallback from '@/components/ImageFallback'
import ProfileSkeleton from '@/components/ProfileSkeleton'
import Toast from '@/components/Toast'
import WrapperLayout from '@/components/WrapperLayout'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { decodeEmail } from '@/utils'
import { Button, Input } from '@nextui-org/react'
import { Camera } from 'iconsax-react'
import { useEffect, useRef, useState } from 'react'

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const email = decodeEmail(params?.id)
  const { userInfo, storeUser } = useStoreUser()
  const [displayName, setDisplayName] = useState(userInfo?.name || '')
  const [onSubmit, setOnSubmit] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleSubmit = async () => {
    try {
      if (!displayName || displayName === userInfo?.name) return

      await instance.put(`/v1/users/${email}`, {
        name: displayName,
        // avatar: userInfo?.picture,
      })
      storeUser({ ...userInfo, name: displayName || '' } as any)
      Toast({
        type: 'success',
        message: 'Update profile successfully',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setOnSubmit(false)
    }
  }

  useEffect(() => {
    if (onSubmit) {
      handleSubmit()
    }
  }, [onSubmit])

  useEffect(() => {
    setDisplayName(userInfo?.name || '')
  }, [userInfo?.name])

  return (
    <WrapperLayout>
      <div className='flex w-full max-w-md rounded-lg border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10'>
        {!!userInfo ? (
          <div className='mx-auto flex w-full flex-col gap-6'>
            <h1 className='text-2xl font-bold'>Edit Profile</h1>
            <div className='relative mx-auto size-[200px] overflow-hidden rounded-full'>
              <input type='file' className='hidden' ref={fileInputRef} />
              <ImageFallback src={userInfo?.picture || ''} alt='avatar' className='size-full object-cover' width={500} height={500} />
              <div onClick={() => fileInputRef.current?.click()} className='absolute bottom-0 left-0 right-0 z-40 flex items-center justify-center rounded-full bg-gray-200 py-2'>
                <Camera size={24} className='text-white' />
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Input
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    setOnSubmit(true)
                  }
                }}
                maxLength={20}
                variant='bordered'
                label='Display Name'
                labelPlacement='outside'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                classNames={{
                  input: 'placeholder:text-white',
                  inputWrapper: 'group-data-[focus=true]:border-white data-[hover=true]:border-white',
                  label: 'group-data-[filled-within=true]:text-white',
                }}
              />
              <Input
                variant='bordered'
                readOnly
                label='Email'
                labelPlacement='outside'
                value={email}
                classNames={{
                  input: 'placeholder:text-white',
                  inputWrapper: 'group-data-[focus=true]:border-white data-[hover=true]:border-white',
                  label: 'group-data-[filled-within=true]:text-white',
                }}
              />

              <Button isLoading={onSubmit} onClick={() => setOnSubmit(true)} className='ml-auto mt-4 min-h-10 w-full bg-white text-indigo-600 hover:bg-indigo-100'>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <ProfileSkeleton />
        )}
      </div>
    </WrapperLayout>
  )
}

export default ProfilePage
