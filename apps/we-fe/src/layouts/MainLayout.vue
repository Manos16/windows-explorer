<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Windows Explorer</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- CONTENT -->
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
/* opsional styling tambahan */
</style>
