<script setup lang="ts">
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Link from '@/components/bases/Link.vue'
</script>

<template>
  <SectionBorder border-colour-class="border-orange-500">
    <SectionTitle version="1.3" anchor="prologue" title="⚠️ Experimental" :add-toc="false" />
    <div class="space-y-4">
      <p class="font-bold">This tool is experimental and must not be relied upon.</p>
      <p>
        It may become properly supported if it proves useful enough. Features may change or stop
        working unexpectedly.
      </p>
      <p>
        This tool is aimed at producing one-off records. Bulk creation should use tools like the
        <Link href="https://gitlab.data.bas.ac.uk/uk-pdc/metadata-infrastructure/metadata-library"
          >BAS Metadata Library</Link
        >
        instead.
      </p>
      <GuidanceText>Meow! Look out for text like this for top tips and guidance.</GuidanceText>
    </div>
  </SectionBorder>
</template>
