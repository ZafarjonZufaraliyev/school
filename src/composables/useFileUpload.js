import { ref } from 'vue'

export function useFileUpload(options = {}) {
  const { accept = '.pdf,.doc,.docx', maxSizeMB = 10 } = options

  const file = ref(null)
  const preview = ref(null)
  const error = ref(null)

  function validate(f) {
    if (!f) return 'Fayl tanlanmadi'
    if (f.size > maxSizeMB * 1024 * 1024) return `Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak`
    return null
  }

  function onFileChange(event) {
    const f = event.target.files[0]
    error.value = validate(f)
    if (!error.value) {
      file.value = f
      if (f.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          preview.value = e.target.result
        }
        reader.readAsDataURL(f)
      }
    }
  }

  function clear() {
    file.value = null
    preview.value = null
    error.value = null
  }

  function toFormData(extraFields = {}) {
    const fd = new FormData()
    if (file.value) fd.append('file', file.value)
    Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v))
    return fd
  }

  return { file, preview, error, accept, onFileChange, clear, toFormData }
}
