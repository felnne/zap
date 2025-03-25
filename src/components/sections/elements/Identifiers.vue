<script setup lang="ts">
import { computed, type ComputedRef, type PropType, ref, watch } from 'vue'

import { ResourceType, Stability, SectionType } from '@/types/enum'

import type { DropdownItem, Licence } from '@/types/app'
import type { Identifier } from '@/types/iso'
import { doiPossible } from '@/lib/identifiers'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import Output from '@/components/bases/Output.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import IdentifierSelf from '@/components/sections/elements/IdentifierSelf.vue'
import IdentifierAlias from '@/components/sections/elements/IdentifierAlias.vue'
import IdentifierDoi from '@/components/sections/elements/IdentifierDoi.vue'
import IdentifierBasGitlab from '@/components/sections/elements/IdentifierBasGitlab.vue'

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
  'update:isoIdentifiers': [id: Identifier[]]
}>()

const addIdentifier = (identifier: Identifier) => {
  identifiers.value = [...identifiers.value, identifier]
}

const removeIdentifier = (identifier: Identifier) => {
  // remove identifiers based on scheme (namespace) as values may be updating
  identifiers.value = identifiers.value.filter((i) => i.namespace !== identifier.namespace)
}

const dependantSections: DropdownItem[] = [
  { href: '#file-identifier', title: 'File Identifier' },
  { href: '#licence', title: 'Licence' },
  { href: '#resource-type', title: 'Resource Type' },
]

const identifiers = ref<Identifier[]>([])

let showDoi: ComputedRef<boolean> = computed(() => {
  // only show DOI identifier if the publisher could be the PDC
  return doiPossible(props.resourceType, props.licence)
})

watch(
  () => identifiers.value,
  () => {
    emit('update:identifiers', identifiers.value)
    emit('update:isoIdentifiers', identifiers.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      :stability="Stability.Stable"
      version="6.1"
      anchor="identifiers"
      title="Identifiers"
      guidance-href="https://gitlab.data.bas.ac.uk/MAGIC/mapping-coordination/-/wikis/metadata-completion-guidance#identifiers"
      :depends-on="dependantSections"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-2">
          <IdentifierSelf
            :file-identifier="fileIdentifier"
            @add:identifier="(event: Identifier) => addIdentifier(event)"
          />
          <IdentifierDoi
            v-if="showDoi"
            :file-identifier="fileIdentifier"
            @add:identifier="(event: Identifier) => addIdentifier(event)"
            @remove:identifier="(event: Identifier) => removeIdentifier(event)"
          />
          <IdentifierAlias
            :resource-type="resourceType"
            @add:identifier="(event: Identifier) => addIdentifier(event)"
            @remove:identifier="(event: Identifier) => removeIdentifier(event)"
          />
          <IdentifierBasGitlab
            @add:identifier="(event: Identifier) => addIdentifier(event)"
            @remove:identifier="(event: Identifier) => removeIdentifier(event)"
          />
        </div>
      </template>
      <template #right>
        <Output :data="identifiers"></Output>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
