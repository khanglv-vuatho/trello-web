'use client'

import { Button, Input } from '@nextui-org/react'
import { ChangeEvent, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { AddButton, CloseButton } from '../Button'
import Toast from '@/components/Toast'

type TCreateColumn = { value: string; setValue: (value: string) => void }

const CreateColumn = ({ value, setValue }: TCreateColumn) => {
  const [isCreateNewColumn, setIsCreateNewColumn] = useState<boolean>(false)
  const handleToggleCreateNewColumn = () => setIsCreateNewColumn(!isCreateNewColumn)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleAddColumn: () => void = () => {
    console.log(123)
    if (value === '') {
      Toast({ message: 'Enter column title', type: 'error' })
    } else {
      setValue('')
      setIsCreateNewColumn(false)
      Toast({ message: 'Add Column Successful', type: 'success' })
    }
  }

  return (
    <div>
      {isCreateNewColumn ? (
        <div className='flex flex-col gap-2 bg-white/10 p-2 rounded-lg w-[300px]'>
          <Input
            autoFocus
            value={value}
            onChange={handleInputChange}
            // classNames={{ inputWrapper: 'group-data-[focus=true]:border-white data-[hover=true]:border-white', mainWrapper: 'border-white', input: 'placeholder:text-white text-white' }}
            // variant='bordered'
            placeholder='Enter card title'
          />
          <div className='flex items-center gap-2'>
            <AddButton onClick={handleAddColumn}>Add column</AddButton>
            <CloseButton onClick={handleToggleCreateNewColumn} />
          </div>
        </div>
      ) : (
        <Button onPress={handleToggleCreateNewColumn} startContent={<AddIcon />} className='bg-white/10 text-white px-5 py-3'>
          Add new column
        </Button>
      )}
    </div>
  )
}

export default CreateColumn
