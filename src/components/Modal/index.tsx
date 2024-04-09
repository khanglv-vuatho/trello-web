import { Modal as ModalNextUI, ModalBody, ModalContent, ModalHeader, ModalFooter, Button } from '@nextui-org/react'

type TModal = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  modalTitle: string
  modalBody: React.ReactNode | string
  modalFooter?: React.ReactNode | string
}
const Modal = ({ isOpen, onOpenChange, modalTitle, modalBody, modalFooter }: TModal) => {
  return (
    <ModalNextUI isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{modalTitle}</ModalHeader>
            <ModalBody>{modalBody}</ModalBody>
            {modalFooter && <ModalFooter>{modalFooter}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </ModalNextUI>
  )
}

export default Modal
