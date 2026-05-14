import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 5,
  newestOnTop: true,
}

export { Toast }
