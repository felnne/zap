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
        Distributor and publisher selection is based on the logic from
        <Link href="https://gitlab.data.bas.ac.uk/MAGIC/data-management/-/issues/41"
          >MAGIC/data-management#41</Link
        >.
      </p>
      <p>
        Records are validated against the BAS Metadata Library
        <Link
          href="https://gitlab.data.bas.ac.uk/uk-pdc/metadata-infrastructure/metadata-library/-/blob/c23fa960c9ff9f4aa3a5be48d8d8f566394aeffa/src/bas_metadata_library/schemas/src/iso_19115_2_v3.json"
          >ISO 19139-2:2012 (v3)</Link
        >
        schema.
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
