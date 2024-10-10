<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { Stability } from '@/types/enum'
import type { KeywordTerm } from '@/types/app'
import type { KeywordSet } from '@/types/iso'
import { getKeywordSet } from '@/lib/data'
import { getUniqueKeywords, getUniqueTopics } from '@/lib/keywords'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import FormLabel from '@/components/bases/FormLabel.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'

const emit = defineEmits<{
  'update:isoTopics': [id: string[]]
  'update:isoKeywords': [id: KeywordSet[]]
}>()

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

watch(
  () => keywords.value,
  () => {
    emit('update:isoKeywords', keywords.value)
  }
)
watch(
  () => isoTopics.value,
  () => {
    emit('update:isoTopics', isoTopics.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="1.2"
      :stability="Stability.Stable"
      anchor="research-topics"
      title="BAS Research Topics"
      :data-file-href="['keywords.json']"
    />
    <TwoColumn>
      <template #left>
        <FormLabel v-for="term in keywordSet.terms" :key="term.slug">
          <input
            :id="'topic-' + term.slug"
            v-model="selectedSlugs"
            type="checkbox"
            name="topics"
            :value="term.slug"
          />
          {{ term.name }}
        </FormLabel>
      </template>
      <template #right>
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
@/lib/data@/lib/keywords
