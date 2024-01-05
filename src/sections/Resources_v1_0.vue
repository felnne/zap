<script setup lang="ts">
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Link from '@/components/Link.vue'
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle version="1.0" anchor="resources" title="Resources" />
    <p>
      Examples of completed records can be found in the
      <Link href="https://gitlab.data.bas.ac.uk/MAGIC/add-catalogue-records-production"
        >Data Catalogue Records</Link
      >
      repository in GitLab.
    </p>
  </SectionBorder>
</template>
