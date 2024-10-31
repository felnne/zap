<script setup lang="ts">
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Link from '@/components/bases/Link.vue'
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle version="2.0" anchor="resources" title="Resources" :add-toc="false" />
    <div class="space-y-4">
      <p>
        Distributor and publisher selections are based on the logic from
        <Link href="https://gitlab.data.bas.ac.uk/MAGIC/data-management/-/issues/41"
          >MAGIC/data-management#41</Link
        >.
      </p>
      <p>
        Records are validated against the BAS Metadata Library
        <Link
          href="https://metadata-resources.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-0-v4.json" target="_blank"
          >ISO 19139-2:2012 (v4)</Link
        >
        and
        <Link
          href="https://metadata-resources.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/magic-discovery-v1.json" target="_blank""
          >MAGIC Discovery Metadata Profile (v1)</Link
        >
        schemas.
      </p>
      <p>
        Examples of completed records can be found in the
        <Link href="https://gitlab.data.bas.ac.uk/MAGIC/add-catalogue-records-production"
          >Data Catalogue Records</Link
        >
        repository in GitLab.
      </p>
    </div>
  </SectionBorder>
</template>
