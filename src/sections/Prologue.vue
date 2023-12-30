<script setup lang="ts">
import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
</script>

<template>
  <SectionBorder border-colour-class="border-amber-500">
    <SectionTitle anchor="prologue" title="⚠️ Experimental" />
    <div class="space-y-2">
      <p class="font-bold">This tool is experimental and must not be relied upon.</p>
      <p>
        It may become properly supported if it proves useful enough. Features may change or stop
        working unexpectedly.
      </p>
    </div>
  </SectionBorder>
</template>
