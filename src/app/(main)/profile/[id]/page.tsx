'use client'

import ImageFallback from '@/components/ImageFallback'
import ProfileSkeleton from '@/components/ProfileSkeleton'
import Toast from '@/components/Toast'
import WrapperLayout from '@/components/WrapperLayout'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { decodeEmail, objectToFormData } from '@/utils'
import { Button, Input } from '@nextui-org/react'
import { Camera } from 'iconsax-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const email = decodeEmail(params?.id)
  const { userInfo, storeUser } = useStoreUser()

  const [displayName, setDisplayName] = useState(userInfo?.name || '')

  const [onSubmit, setOnSubmit] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [imageUI, setImageUI] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [onFetchingDetailUser, setOnFetchingDetailUser] = useState(false)
  const [storeAnotherUser, setStoreAnotherUser] = useState<any>(null)
  const isOwner = userInfo?.email === email

  const handleChangeAvatar = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setFile(file)
      const objectUrl = URL.createObjectURL(file)
      setImageUI(objectUrl)
    }

    event.target.value = ''
  }

  const handleSubmit = async () => {
    try {
      if (!isOwner) {
        Toast({
          type: 'error',
          message: 'You do not have permission to edit this profile'
        })
        return
      }
      if (!displayName || (displayName === userInfo?.name && file === null)) return
      const payload = {
        name: displayName,
        avatar: file
      }
      await instance.put(`/v1/users/${email}`, objectToFormData(payload))
      storeUser({ ...userInfo, name: displayName || '', picture: imageUI || null } as any)
      setFile(null)
      Toast({
        type: 'success',
        message: 'Update profile successfully'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setOnSubmit(false)
    }
  }

  const handleFetchingDetailUser = async () => {
    if (isOwner) return
    try {
      const dataUser: any = await instance.get(`/v1/users/${email}`)
      setStoreAnotherUser(dataUser?.user)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingDetailUser(false)
    }
  }

  useEffect(() => {
    onSubmit && handleSubmit()
  }, [onSubmit])

  useEffect(() => {
    setDisplayName(userInfo?.name || '')
    setImageUI(userInfo?.picture || null)
  }, [userInfo?.name])

  // Cleanup object URL when component unmounts or imageUI changes
  useEffect(() => {
    return () => {
      if (imageUI && imageUI !== userInfo?.picture) {
        URL.revokeObjectURL(imageUI)
      }
    }
  }, [imageUI])

  useEffect(() => {
    if (isOwner) return
    if (!userInfo?.email) return

    if (onFetchingDetailUser) {
      handleFetchingDetailUser()
    }
  }, [onFetchingDetailUser, userInfo?.email])

  useEffect(() => {
    if (isOwner) return
    if (!userInfo?.email) return
    setOnFetchingDetailUser(true)
  }, [userInfo?.email])

  return (
    <WrapperLayout>
      <div className='flex w-full max-w-md rounded-lg border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10'>
        {!!userInfo ? (
          <div className='mx-auto flex w-full flex-col gap-6'>
            <h1 className='text-2xl font-bold'>{isOwner ? 'Edit Profile' : `${storeAnotherUser?.name}'s Profile`}</h1>
            <div className='relative mx-auto size-[200px] overflow-hidden rounded-full'>
              {isOwner && <input accept='image/*' onChange={handleChangeAvatar} type='file' className='hidden' ref={fileInputRef} />}
              <ImageFallback
                src={isOwner ? imageUI || '' : storeAnotherUser?.picture || ''}
                alt='avatar'
                className='size-full object-cover'
                width={500}
                height={500}
              />
              {isOwner && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute bottom-0 left-0 right-0 z-40 flex items-center justify-center rounded-full bg-gray-200 py-2'
                >
                  <Camera size={24} className='text-white' />
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <Input
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && isOwner) {
                    setOnSubmit(true)
                  }
                }}
                maxLength={20}
                variant='bordered'
                label='Display Name'
                labelPlacement='outside'
                value={isOwner ? displayName : storeAnotherUser?.name}
                onChange={(e) => isOwner && setDisplayName(e.target.value)}
                readOnly={!isOwner}
                classNames={{
                  input: 'placeholder:text-white',
                  inputWrapper: 'group-data-[focus=true]:border-white data-[hover=true]:border-white',
                  label: 'group-data-[filled-within=true]:text-white'
                }}
              />

              <Input
                variant='bordered'
                readOnly
                label='Email'
                labelPlacement='outside'
                value={isOwner ? email : storeAnotherUser?.email}
                classNames={{
                  input: 'placeholder:text-white',
                  inputWrapper: 'group-data-[focus=true]:border-white data-[hover=true]:border-white',
                  label: 'group-data-[filled-within=true]:text-white'
                }}
              />

              {isOwner && (
                <Button
                  isLoading={onSubmit}
                  onClick={() => setOnSubmit(true)}
                  className='ml-auto mt-4 min-h-10 w-full bg-white text-blue-500 hover:bg-indigo-100'
                >
                  Save
                </Button>
              )}
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
