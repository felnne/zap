<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType, Stability } from '@/types/enum'
import type { Licence } from '@/types/app'
import type { Identifier } from '@/types/iso'
import { getPublisherOrgSlug } from '@/utils/contacts'

import SectionBorder from '@/components/SectionBorder.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import Output from '@/components/Output.vue'
import IdentifierSelf from '@/sections/IdentifierSelf.vue'
import IdentifierDoi from '@/sections/IdentifierDoi.vue'
import IdentifierEsri from '@/sections/IdentifierEsri.vue'
import IdentifierBasGitlab from '@/sections/IdentifierBasGitlab.vue'
import TwoColumn from '@/components/TwoColumn.vue'

const props = defineProps({
  fileIdentifier: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String as PropType<ResourceType>,
    required: true,
  },
  licence: {
    type: Object as PropType<Licence>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:identifiers': [id: Identifier[]]
}>()

const addIdentifier = (identifier: Identifier) => {
  identifiers.value = [...identifiers.value, identifier]
}

const removeIdentifier = (identifier: Identifier) => {
  // remove identifiers based on scheme (title) as values may be updating
  identifiers.value = identifiers.value.filter((i) => i.title !== identifier.title)
}

const identifiers = ref<Identifier[]>([])

let showDoi: ComputedRef<boolean> = computed(() => {
  // only show DOI identifier if the publisher is the PDC
  const publisherSlug = getPublisherOrgSlug(props.resourceType, props.licence)
  return publisherSlug === 'nerc_eds_pdc' ? true : false
})

watch(
  () => identifiers.value,
  () => {
    emit('update:identifiers', identifiers.value)
  }
)
</script>

<template>
  <SectionBorder>
    <SectionTitle
      version="4.0"
      :stability="Stability.Experimental"
      anchor="identifiers"
      title="Identifiers"
    />
    <TwoColumn>
      <template v-slot:left>
        <div class="space-y-2">
          <IdentifierSelf
            :fileIdentifier="fileIdentifier"
            @add:identifier="(event: Identifier) => addIdentifier(event)"
          />
          <IdentifierDoi
            v-if="showDoi"
            :fileIdentifier="fileIdentifier"
            @add:identifier="addIdentifier($event)"
            @remove:identifier="removeIdentifier($event)"
          />
          <IdentifierEsri
            @add:identifier="(event: Identifier) => addIdentifier(event)"
            @remove:identifier="(event: Identifier) => removeIdentifier(event)"
          />
          <IdentifierBasGitlab
            @add:identifier="(event: Identifier) => addIdentifier(event)"
            @remove:identifier="(event: Identifier) => removeIdentifier(event)"
          />
        </div>
      </template>
      <template v-slot:right>
        <Output :data="identifiers"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
