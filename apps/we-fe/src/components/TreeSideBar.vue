<template>
  <div class="q-pa-sm">
    <q-spinner v-if="loading" color="primary" />

    <div v-else>
      <TreeChild
          v-for="folder in treeData?.root || []"
          :key="folder.id"
          :folder="folder"
          @select-folder="$emit('select-folder', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import TreeChild from './TreeChild.vue'
import { useFoldersTree } from '@/composables/useFoldersTree'

const { treeData, fetchChildren, loading } = useFoldersTree()

async function refreshTree() {
  treeData.value = {}
  await fetchChildren(null)
}

onMounted(() => {
  fetchChildren(null)
})

defineExpose({ refreshTree })
</script>
