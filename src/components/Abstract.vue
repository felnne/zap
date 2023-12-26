<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'
</script>

<template>
  <section class="mb-5 p-5 border-4 border-gray-500">
    <SectionTitle anchor="abstract" title="Abstract" />
    <Freetext input-class="min-h-60" />
  </section>
</template>
