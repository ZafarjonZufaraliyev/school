import { ref } from 'vue'

const isOpen = ref(false)
const message = ref('')
const resolveFn = ref(null)

export function useConfirm() {
  function confirm(msg = 'Ishonchingiz komilmi?') {
    message.value = msg
    isOpen.value = true
    return new Promise((resolve) => {
      resolveFn.value = resolve
    })
  }

  function accept() {
    isOpen.value = false
    resolveFn.value?.(true)
  }

  function cancel() {
    isOpen.value = false
    resolveFn.value?.(false)
  }

  return { isOpen, message, confirm, accept, cancel }
}
