import { ref } from 'vue'
import { getBaseApiUrl} from '@/config/env'
import type { Folder, File } from '@shared/types'


export function useFolderContents() {
    const folders = ref<Folder[]>([])
    const files = ref<File[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchContents = async (parentId: number | null = null) => {
        loading.value = true
        try {
            const baseUrl = getBaseApiUrl()
            const url = parentId
                ? `${baseUrl}/folders?parentId=${parentId}`
                : `${baseUrl}/folders`

            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to fetch folders')

            const json = await res.json()
            folders.value = Array.isArray(json.data.folders) ? json.data.folders : []
            files.value = Array.isArray(json.data.files) ? json.data.files : []
        } catch (err: any) {
            error.value = err.message
            folders.value = []
            files.value = []
        } finally {
            loading.value = false
        }
    }

    return { folders, files, loading, error, fetchContents }
}
