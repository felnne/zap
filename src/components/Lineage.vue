<script setup lang="ts">
import SectionBorder from './SectionBorder.vue'
import SectionTitle from './SectionTitle.vue'
import Freetext from './Freetext.vue'
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="lineage" title="Lineage" />
    <Freetext input-class="min-h-60" />
  </SectionBorder>
</template>
