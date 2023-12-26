<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle
      anchor="title"
      title="Title"
      guidance-href="https://gitlab.data.bas.ac.uk/felnne/zap/-/blob/main/docs/eds-guidance.md#title"
    />
    <Freetext />
  </section>
</template>
