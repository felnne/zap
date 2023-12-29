<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import Link from './Link.vue'
</script>

<template>
  <aside class="mb-5 p-5 border-4 border-sky-500">
    <SectionTitle anchor="resources" title="Resources" />
    <p class="text-black dark:text-white">
      Examples of completed records can be found in the
      <Link href="https://gitlab.data.bas.ac.uk/MAGIC/add-catalogue-records-production"
        >Data Catalogue Records</Link
      >
      repository in GitLab.
    </p>
  </aside>
</template>
