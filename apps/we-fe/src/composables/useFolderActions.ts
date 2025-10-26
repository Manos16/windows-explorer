import { ref } from 'vue'
import { env } from '@/config/env'

export function useFolderActions(fetchContents: (parentId: number | null) => Promise<void>) {
    const creating = ref(false)
    const error = ref<string | null>(null)
    const uploading = ref(false)

    async function createFolder(name: string, parentId: number | null = null) {
        if (!name.trim()) return
        creating.value = true
        error.value = null

        try {
            const res = await fetch(`${env.apiUrl}/api/v1/folders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), parentId }),
            })

            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.message || 'Gagal membuat folder')

            // refresh daftar folder
            await fetchContents(parentId)
            return data
        } catch (err: any) {
            error.value = err.message || 'Terjadi kesalahan saat membuat folder'
            throw err
        } finally {
            creating.value = false
        }
    }

    const uploadFile = async (files: FileList, currentFolderId: number | null = null) => {
        if (!files || files.length === 0) return

        uploading.value = true
        error.value = null

        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)

                if (currentFolderId !== null) {
                    formData.append('folderId', currentFolderId.toString())
                }

                const res = await fetch(`${env.apiUrl}/api/v1/files`, {
                    method: 'POST',
                    body: formData,
                })

                if (!res.ok) throw new Error('Gagal mengunggah file')
            }

            return true
        } catch (err: any) {
            error.value = err.message || 'Terjadi kesalahan saat upload file'
            console.error(error.value)
            return false
        } finally {
            uploading.value = false
        }
    }

    return { createFolder, creating, uploading, error, uploadFile, }
}
