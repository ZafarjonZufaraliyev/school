import { ref, computed } from 'vue'

export function usePagination(defaultPageSize = 20) {
  const page = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const offset = computed(() => (page.value - 1) * pageSize.value)

  const params = computed(() => ({
    limit: pageSize.value,
    offset: offset.value,
  }))

  function setTotal(count) {
    total.value = count
  }
  function goTo(p) {
    page.value = Math.max(1, Math.min(p, totalPages.value))
  }
  function next() {
    if (page.value < totalPages.value) page.value++
  }
  function prev() {
    if (page.value > 1) page.value--
  }
  function reset() {
    page.value = 1
  }

  return { page, pageSize, total, totalPages, params, setTotal, goTo, next, prev, reset }
}
