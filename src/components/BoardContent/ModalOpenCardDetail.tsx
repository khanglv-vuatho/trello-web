import { Button } from '@nextui-org/react'
import { ICard } from '@/types'
import Modal from '../Modal'
import { useStoreBoard } from '@/store'

type ModalOpenCardDetailProps = {
  isOpenModalDetailCard: boolean
  setIsOpenModalDetailCard: (value: boolean) => void
  card: ICard
}

const ModalOpenCardDetail = ({ isOpenModalDetailCard, setIsOpenModalDetailCard, card }: ModalOpenCardDetailProps) => {
  const { board } = useStoreBoard()
  const currentColumn = board?.columns.find((column) => column._id === card?.columnId)
  console.log({ currentColumn })
  if (!card) return null
  return (
    <Modal size='4xl' isOpen={isOpenModalDetailCard} onOpenChange={() => setIsOpenModalDetailCard(false)} modalTitle={card?.title} modalFooter={<>123</>}>
      Are you sure you want to delete this card?
    </Modal>
  )
}

export default ModalOpenCardDetail
