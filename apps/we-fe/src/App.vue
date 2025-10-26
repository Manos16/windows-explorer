<template>
  <MainLayout>
    <div class="row q-col-gutter-md full-height">
      <!-- SIDEBAR -->
      <div class="col-3 q-pl-lg full-height" style="border-right: 1px solid #ccc; min-height: 96vh;">
        <TreeSidebar ref="treeRef" @select-folder="handleSelectFolder" />
      </div>

      <div class="col-9">
        <TableView
            :folders="folders"
            :files="files"
            :loading="loading"
            :currentFolderId="selectedFolderId"
            :fetchContents="fetchContents"
            @folder-added="handleFolderAdded"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import TreeSidebar from './components/TreeSidebar.vue'
import TableView from './components/TableView.vue'
import { useFolderContents } from '@/composables/useFoldersContents'
import MainLayout from "@/layouts/MainLayout.vue";

const { folders, files, loading, fetchContents } = useFolderContents()
const selectedFolderId = ref<number | null>(null)
const treeRef = ref<InstanceType<typeof TreeSidebar> | null>(null)
const handleSelectFolder = (id: number | null) => {
  selectedFolderId.value = id
  fetchContents(folderId)
}

watchEffect(() => {
  fetchContents(selectedFolderId.value)
})

function handleFolderAdded() {
  treeRef.value?.refreshTree?.()  // 👈 pastikan fungsi ini ada di TreeSidebar.vue
}
</script>
