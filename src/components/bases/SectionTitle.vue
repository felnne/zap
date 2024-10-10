<script setup lang="ts">
import { computed, type ComputedRef, type PropType, onMounted, ref } from 'vue'

import { Stability } from '@/types/enum'
import type { DropdownItem } from '@/types/app'
import { getSetting } from '@/lib/data'

import DropDown from '@/components/bases/DropDown.vue'
import Link from '@/components/bases/Link.vue'

const props = defineProps({
  version: {
    type: String,
    required: true,
  },
  stability: {
    type: String as PropType<Stability>,
    default: Stability.Stable,
  },
  anchor: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: false,
    default: '',
  },
  dataFileHref: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  guidanceHref: {
    type: String,
    required: false,
    default: '',
  },
  addToc: {
    type: Boolean,
    required: false,
    default: true,
  },
  dependsOn: {
    type: Array as PropType<DropdownItem[]>,
    required: false,
    default: () => [],
  },
})

let teleport = ref<boolean>(false)

let dataFilesHrefQualified: ComputedRef<DropdownItem[]> = computed(() => {
  return props.dataFileHref.map((href) => ({
    href: `${getSetting('app_section_data_file_url_base')}/${href}`,
    title: href,
  }))
})

let stabilityClasses: ComputedRef<string[]> = computed(() => {
  const classes = []

  if (props.stability === Stability.Experimental) {
    classes.push('text-indigo-500')
  } else if (props.stability === Stability.Stable) {
    classes.push('text-green-500')
  }

  return classes
})

onMounted(() => {
  teleport.value = true
})
</script>

<template>
  <header class="mb-5 space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex space-x-2">
        <h2 :id="anchor" class="flex-grow text-2xl font-semibold">{{ title }}</h2>
        <div class="flex flex-col justify-center">
          <div class="section-version text-[8px] text-neutral-500">{{ version }}</div>
          <div class="section-stability text-[8px]" :class="stabilityClasses">{{ stability }}</div>
        </div>
      </div>
      <div class="flex gap-4">
        <DropDown
          v-if="dataFilesHrefQualified.length > 0"
          title="Data Files"
          :items="dataFilesHrefQualified"
          :items-classes="['section-data-file']"
        >
        </DropDown>
        <Link v-if="guidanceHref != ''" class="section-guidance" :href="guidanceHref"
          >View Guidance</Link
        >
        <DropDown
          v-if="dependsOn.length > 0"
          title="Depends On"
          :items="dependsOn"
          :items-classes="['section-depends-on']"
        >
        </DropDown>
        <Link
          class="section-top ml-auto bg-transparent no-underline dark:bg-neutral-300"
          href="#top"
          >🔝</Link
        >
      </div>
    </div>
    <h3 v-if="subTitle != ''" class="text-xl font-semibold text-neutral-500">
      {{ subTitle }}
    </h3>
  </header>
  <Teleport v-if="teleport && addToc" to="#toc-items">
    <Link class="toc-item" :href="`#${anchor}`">{{ title }}</Link>
  </Teleport>
</template>
