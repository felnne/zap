<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import { Stability } from '@/types/enum'
import { getKeywordSet } from '@/utils/data'
import { getUniqueKeywords, getUniqueTopics } from '@/utils/keywords'
import type { KeywordTerm } from '@/types/app'
import type { KeywordSet } from '@/types/iso'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import FormLabel from '@/components/FormLabel.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const keywordSetSlug = 'bas_research_topics'
const keywordSet = getKeywordSet(keywordSetSlug)

let selectedSlugs = ref<string[]>([])

let selectedTerms: ComputedRef<KeywordTerm[]> = computed(() => {
  return keywordSet.terms.filter((term) => selectedSlugs.value.includes(term.slug))
})

let keywords: ComputedRef<KeywordSet[]> = computed(() => {
  return getUniqueKeywords(selectedTerms.value.flatMap((term) => term.keywords))
})

let isoTopics: ComputedRef<string[]> = computed(() => {
  return getUniqueTopics(selectedTerms.value.flatMap((term) => term.isoTopics))
})
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="1.0"
      :stability="Stability.Stable"
      anchor="research-topics"
      title="BAS Research Topics"
    />
    <TwoColumn>
      <template v-slot:left>
        <FormLabel v-for="term in keywordSet.terms" :key="term.slug">
          <input
            type="checkbox"
            name="topics"
            :id="'topic-' + term.slug"
            :value="term.slug"
            v-model="selectedSlugs"
          />
          {{ term.name }}
        </FormLabel>
      </template>
      <template v-slot:right>
        <div class="space-y-4">
          <div class="space-y-2">
            <p>Keywords:</p>
            <Output id="keywords" :data="keywords"></Output>
          </div>
          <div class="space-y-2">
            <p>ISO Topics:</p>
            <Output id="iso-topics" :data="isoTopics"></Output>
          </div>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
