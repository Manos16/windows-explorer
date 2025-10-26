import { ref } from 'vue'
import { getBaseApiUrl} from '@/config/env'
import type { Folder } from '@shared/types'

export function useFoldersTree() {
    const treeData = ref<Record<number | 'root', Folder[]>>({ root: [] })
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchChildren = async (parentId: number | null = null) => {
        const key = parentId ?? 'root'
        if (treeData.value[key] && treeData.value[key].length > 0) return

        loading.value = true
        try {
            const baseUrl = getBaseApiUrl()
            const url = parentId
                ? `${baseUrl}/folders?parentId=${parentId}`
                : `${baseUrl}/folders`

            const res = await fetch(url)
            const json = await res.json()
            const folders = json?.data?.folders || []

            treeData.value = {
                ...treeData.value,
                [key]: folders
            }
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { treeData, fetchChildren, loading, error }
}
