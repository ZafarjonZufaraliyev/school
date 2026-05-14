import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockAssignmentsService as assignmentsService } from '@/services/mock.service'

export const useAssignmentsStore = defineStore('assignments', () => {
  const assignments = ref([])
  const currentAssignment = ref(null)
  const submissions = ref([])
  const isLoading = ref(false)

  async function fetchAssignments(params = {}) {
    isLoading.value = true
    try {
      const { data } = await assignmentsService.getAll(params)
      assignments.value = data.results ?? data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAssignment(id) {
    const { data } = await assignmentsService.getById(id)
    currentAssignment.value = data
    return data
  }

  async function createAssignment(payload) {
    const { data } = await assignmentsService.create(payload)
    assignments.value.unshift(data)
    return data
  }

  async function updateAssignment(id, payload) {
    const { data } = await assignmentsService.update(id, payload)
    const idx = assignments.value.findIndex((a) => a.id === id)
    if (idx !== -1) assignments.value[idx] = data
    return data
  }

  async function deleteAssignment(id) {
    await assignmentsService.delete(id)
    assignments.value = assignments.value.filter((a) => a.id !== id)
  }

  async function toggleUpload(id, isOpen) {
    const { data } = await assignmentsService.toggleUpload(id, { upload_open: isOpen })
    const idx = assignments.value.findIndex((a) => a.id === id)
    if (idx !== -1) assignments.value[idx].upload_open = isOpen
    if (currentAssignment.value?.id === id) currentAssignment.value.upload_open = isOpen
    return data
  }

  async function submitAssignment(id, formData) {
    return (await assignmentsService.submit(id, formData)).data
  }

  async function fetchSubmissions(assignmentId) {
    const { data } = await assignmentsService.getSubmissions(assignmentId)
    submissions.value = data
    return data
  }

  async function gradeSubmission(submissionId, payload) {
    const { data } = await assignmentsService.gradeSubmission(submissionId, payload)
    const idx = submissions.value.findIndex((s) => s.id === submissionId)
    if (idx !== -1) submissions.value[idx] = { ...submissions.value[idx], ...data }
    return data
  }

  return {
    assignments,
    currentAssignment,
    submissions,
    isLoading,
    fetchAssignments,
    fetchAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    toggleUpload,
    submitAssignment,
    fetchSubmissions,
    gradeSubmission,
  }
})
