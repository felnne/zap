<script setup lang="ts">
import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Freetext from '../components/Freetext.vue'
</script>

<template>
  <SectionBorder>
    <SectionTitle anchor="abstract" title="Abstract" />
    <Freetext input-class="min-h-60" />
  </SectionBorder>
</template>
