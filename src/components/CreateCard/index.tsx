'use client'

import { Add as AddIcon, DragHandle as DragHandleIcon, MoreHoriz as MoreHorizIcon } from '@mui/icons-material'
import { Button, Input } from '@nextui-org/react'
import ExpandButton from '../ExpandButton'
import { ChangeEvent, useState } from 'react'
import { AddButton, CloseButton } from '../Button'
import Toast from '../Toast'

type TCreateCard = { value: string; setValue: (value: string) => void }
const CreateCard = ({ value, setValue }: TCreateCard) => {
  const [isCreateNewCard, setIsCreateNewCard] = useState<boolean>(false)

  const handleToggleCreateNewCard = () => setIsCreateNewCard(!isCreateNewCard)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleAddColumn: () => void = () => {
    if (value === '') {
      Toast({ message: 'Enter card title', type: 'error' })
    } else {
      setValue('')
      setIsCreateNewCard(false)
      Toast({ message: 'Add Card Successful', type: 'success' })
    }
  }

  return (
    <>
      <div className='p-2'>
        {isCreateNewCard ? (
          <div className='flex items-center gap-2'>
            <Input
              autoFocus
              classNames={{
                inputWrapper: 'group-data-[focus=true]:border-[#00a8ff] data-[hover=true]:border-[#00a8ff] border-[#00a8ff]',
                input: 'placeholder:text-[#00a8ff] text-[#00a8ff]',
              }}
              variant='bordered'
              placeholder='Enter column title'
              value={value}
              onChange={handleInputChange}
            />
            <AddButton onPress={handleAddColumn}>Add</AddButton>
            <CloseButton onPress={handleToggleCreateNewCard} />
          </div>
        ) : (
          <div className='flex items-center'>
            <Button onPress={handleToggleCreateNewCard} startContent={<AddIcon className='text-[#091E42]' />} className='rounded-lg w-full justify-start p-2 hover:bg-[#091E4224] bg-transparent'>
              Add a card
            </Button>
            <ExpandButton isIconOnly content={<>DragHandleIcon ...</>}>
              <DragHandleIcon className='text-black' />
            </ExpandButton>
          </div>
        )}
      </div>
    </>
  )
}

export default CreateCard
