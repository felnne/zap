<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
</script>

<template>
  <aside class="mb-5 p-5 border-4 border-amber-400 text-black dark:text-white">
    <SectionTitle anchor="prologue" title="⚠️ Experimental" />
    <div class="space-y-2">
      <p class="font-bold">This tool is experimental and must not be relied upon.</p>
      <p>
        It may become properly supported if it proves useful enough. Features may change or stop
        working unexpectedly.
      </p>
    </div>
  </aside>
</template>
