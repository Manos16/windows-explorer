<template>
  <div>
    <div
        class="cursor-pointer flex items-center q-pa-xs"
        @click="handleClick"
    >
      <q-icon name="folder" color="amber" class="q-mr-sm" />
      <span>{{ folder.name }}</span>
    </div>

    <div v-if="expanded" class="q-ml-md">
      <TreeChild
          v-for="child in children"
          :key="child.id"
          :folder="child"
          @select-folder="$emit('select-folder', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFoldersTree } from '@/composables/useFoldersTree'
import TreeChild from './TreeChild.vue'
import type { Folder } from "@shared/types/folder.ts";

const props = defineProps<{ folder: Folder }>()
const emit = defineEmits(['select-folder'])
const expanded = ref(false)

const { treeData, fetchChildren } = useFoldersTree()
const children = computed(() => treeData.value[props.folder.id] || [])

const handleClick = async () => {
  expanded.value = !expanded.value

  if (expanded.value && !treeData.value[props.folder.id]) {
    await fetchChildren(props.folder.id)
  }
  emit('select-folder', props.folder.id)
}
</script>
