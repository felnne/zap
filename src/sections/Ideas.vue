<script setup lang="ts">
import { getIdeas } from '@/utils/data'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Idea from '@/sections/Idea.vue'
import GuidanceText from '@/components/GuidanceText.vue'

const ideas = getIdeas()
const feedbackText =
  "If there's something else you think would be a good idea please use the feedback tool (bottom right)."
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
