<script setup lang="ts">
import { getIdeas } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Idea from '@/components/sections/info/Idea.vue'

const ideas = getIdeas()
const feedbackText = 'Thought of a good idea? Suggest it using feedback tool (bottom right).'
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle version="2.1" anchor="ideas" title="Ideas" :add-toc="false" />
    <div class="space-y-4">
      <GuidanceText>{{ feedbackText }}</GuidanceText>
      <div class="space-y-2">
        <Idea v-for="(idea, index) in ideas" :key="index" :idea="idea" />
      </div>
      <GuidanceText>{{ feedbackText }}</GuidanceText>
    </div>
  </SectionBorder>
</template>
@/lib/data
