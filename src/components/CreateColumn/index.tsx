'use client'

import { Button, Input } from '@nextui-org/react'
import { ChangeEvent, useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { AddButton, CloseButton } from '../Button'
import Toast from '@/components/Toast'
import { useStoreBoard } from '@/store'
import instance from '@/services/axiosConfig'
import { IBoard } from '@/types'

type TCreateColumn = { value: string; setValue: (value: string) => void }

const CreateColumn = ({ value, setValue }: TCreateColumn) => {
  const [isCreateNewColumn, setIsCreateNewColumn] = useState<boolean>(false)
  const [onSending, setOnSending] = useState<boolean>(false)

  const { createNewColumn } = useStoreBoard()
  const board = useStoreBoard((state) => state.board)

  const handleToggleCreateNewColumn = () => setIsCreateNewColumn(!isCreateNewColumn)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleAddColumn: () => void = async () => {
    if (value === '') {
      Toast({ message: 'Enter column title', type: 'error' })
      return
    } else {
      setOnSending(true)
    }
  }
  const handleSendingColumn = async () => {
    try {
      await createNewColumn(board as IBoard, value)

      Toast({ message: 'Add Column Successful', type: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setValue('')
      setIsCreateNewColumn(false)
      setOnSending(false)
    }
  }

  useEffect(() => {
    onSending && handleSendingColumn()
  }, [onSending])

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
