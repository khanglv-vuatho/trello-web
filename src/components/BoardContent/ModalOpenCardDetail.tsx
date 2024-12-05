import { Button } from '@nextui-org/react'
import { ICard } from '@/types'
import Modal from '../Modal'
import { useStoreBoard, useStoreStatusOpenModal } from '@/store'

type ModalOpenCardDetailProps = {
  isOpenModalDetailCard: boolean
  setIsOpenModalDetailCard: (value: boolean) => void
  card: ICard
}

const ModalOpenCardDetail = ({ isOpenModalDetailCard, setIsOpenModalDetailCard, card }: ModalOpenCardDetailProps) => {
  const { board } = useStoreBoard()
  const { storeStatusOpenModal } = useStoreStatusOpenModal()
  if (!card) return null
  const handleCloseModal = () => {
    setIsOpenModalDetailCard(false)
    storeStatusOpenModal(false)
  }
  return (
    <Modal size='4xl' isOpen={isOpenModalDetailCard} onOpenChange={handleCloseModal} modalTitle={card?.title} modalFooter={<>123</>}>
      Are you sure you want to delete this card?
    </Modal>
  )
}

export default ModalOpenCardDetail
