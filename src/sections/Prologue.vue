<script setup lang="ts">
import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import GuidanceText from '@/components/GuidanceText.vue'
</script>

<template>
  <SectionBorder border-colour-class="border-amber-500">
    <SectionTitle version="1.2" anchor="prologue" title="⚠️ Experimental" :add-toc="false" />
    <div class="space-y-2">
      <p class="font-bold">This tool is experimental and must not be relied upon.</p>
      <p>
        It may become properly supported if it proves useful enough. Features may change or stop
        working unexpectedly.
      </p>
      <GuidanceText>Meow! Look out for text like this for top tips and guidance.</GuidanceText>
    </div>
  </SectionBorder>
</template>
