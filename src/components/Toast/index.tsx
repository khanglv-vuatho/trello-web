import { ToastOptions, TypeOptions, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type TToast = {
  message: string
  autoClose?: number
  hideProgressBar?: boolean
  closeOnClick?: boolean
  pauseOnHover?: boolean
  draggable?: boolean
  type: TypeOptions
} & ToastOptions

const Toast = ({ message, autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, type, ...props }: TToast) => {
  toast(message, {
    position: 'top-right',
    autoClose: autoClose || 3000,
    hideProgressBar: hideProgressBar || false,
    closeOnClick: closeOnClick || true,
    pauseOnHover: pauseOnHover || true,
    draggable: draggable || true,
    progress: undefined,
    type: type,
    ...props,
  })
}

export default Toast
