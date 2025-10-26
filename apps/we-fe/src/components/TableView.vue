<template>
  <div class="q-pa-md" style="position: relative;">
    <q-spinner v-if="loading" />
    <q-btn
        v-if="canGoBack"
        flat
        color="primary"
        icon="arrow_back"
        label="Kembali"
        class="q-mb-md"
        @click="goBack"
    />
    <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
        @row-click="handleRowClick"
    >
      <template v-slot:body-cell-name="{ row }">
        <q-td>
          <q-icon
              :name="row.type === 'Folder' ? 'folder' : 'insert_drive_file'"
              class="q-mr-sm"
          />
          {{ row.name }}
        </q-td>
      </template>
    </q-table>

    <!-- Floating Action Button -->
    <div class="floating-fab">
      <q-fab
          v-model="fabOpen"
          vertical-actions-align="right"
          color="primary"
          icon="add"
          direction="up"
      >
        <q-fab-action
            color="primary"
            icon="upload_file"
            label="Upload File"
            label-position="left"
            @click="handleUploadFile"
        />

        <q-fab-action
            color="amber"
            icon="create_new_folder"
            label="New Folder"
            label-position="left"
            @click="handleAddFolder"
        />
      </q-fab>
      <input
          type="file"
          ref="fileInputRef"
          multiple
          style="display: none"
          @change="onFileSelected"
      />
    </div>

    <!-- Dialog Tambah Folder -->
    <q-dialog v-model="showFolderDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Tambah Folder Baru</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
              v-model="folderName"
              label="Nama Folder"
              outlined
              autofocus
              :disable="creating"
              @keyup.enter="confirmAddFolder"
              :rules="[val => !!val || 'Nama folder tidak boleh kosong']"
          >
            <template v-slot:prepend>
              <q-icon name="folder" color="amber" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="grey" @click="cancelAddFolder" />
          <q-btn
              flat
              label="Buat"
              color="primary"
              @click="confirmAddFolder"
              :disable="!folderName || creating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {useFolderActions} from "@/composables/useFolderActions.ts";
import type {Folder} from "@shared/types/folder.ts";

const props = defineProps<{
  folders: any[]
  files: any[]
  loading: boolean
  currentFolderId?: number | null
  fetchContents: (parentId: number | null) => Promise<void> // langsung pakai dari parent
}>()
const { createFolder, uploadFile, creating, error } = useFolderActions(props.fetchContents)
const fabOpen = ref(false)
const showFolderDialog = ref(false)
const folderName = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  uploadFile: [files: FileList]
  addFolder: [folderName: string]
  folderAdded: []
}>()


const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'dateModified', label: 'Date Modified', field: 'dateModified', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'left' },
  { name: 'size', label: 'Size', field: 'size', align: 'left', format: (val: number | null | undefined) => formatFileSize(val) },
]

function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return '-'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)

  return `${size.toFixed(2)} ${units[i]}`
}


const rows = computed(() => [
  ...(Array.isArray(props.folders) ? props.folders.map(f => ({ ...f, type: 'Folder' })) : []),
  ...(Array.isArray(props.files) ? props.files.map(f => ({ ...f, type: 'File' })) : [])
])

function handleAddFolder() {
  fabOpen.value = false
  showFolderDialog.value = true
}

async function confirmAddFolder() {
  if (!folderName.value.trim()) return
  try {
    await createFolder(folderName.value, props.currentFolderId ?? null)
    showFolderDialog.value = false
    folderName.value = ''
    await props.fetchContents(props.currentFolderId ?? null)
    emit('folderAdded')
  } catch (err) {
    alert(error.value)
  }
}

function cancelAddFolder() {
  showFolderDialog.value = false
  folderName.value = ''
}

function handleUploadFile() {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const success = await uploadFile(target.files, props.currentFolderId ?? null)
  if (success) {
    await props.fetchContents(props.currentFolderId ?? null)
    emit('folderAdded')
  }

  target.value = ''
}

async function handleRowClick(evt: any, row: Folder) {
  if (row.type === 'Folder') {
    console.log('Klik folder:', row)

    try {
      await props.fetchContents(row.id)
      emit('folderAdded')
    } catch (error) {
      console.error('Gagal membuka folder:', error)
    }
  }
}

</script>

<style scoped>
.floating-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.floating-fab .q-fab {
  transition: transform 0.2s ease;
}

.floating-fab .q-fab:hover {
  transform: scale(1.05);
}
</style>
