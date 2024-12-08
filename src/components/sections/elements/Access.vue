<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'

import { Stability, SectionType } from '@/types/enum'
import { createAccessConstraint, decodeAccessConstraintPermissions } from '@/lib/constraints'
import type { AccessPermission, AccessRestriction } from '@/types/app'
import type { Constraint } from '@/types/iso'

import Output from '@/components/bases/Output.vue'
import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import TwoColumn from '@/components/bases/TwoColumn.vue'
import AccessAnonymous from '@/components/sections/elements/AccessAnonymous.vue'
import AccessNerc from '@/components/sections/elements/AccessNerc.vue'

const emit = defineEmits<{
  'update:access': [id: AccessRestriction]
  'update:isoAccess': [id: Constraint]
}>()

const nullRestriction: AccessRestriction = {
  slug: '-',
  restriction: '-',
  label: '-',
  permissions: [],
}

let selectedSlug = ref<string>('anonymous')
let accessRestriction = ref<AccessRestriction>(nullRestriction)

let accessConstraint: ComputedRef<Constraint> = computed(() => {
  return createAccessConstraint(accessRestriction.value)
})

let accessPermissionsDecoded: ComputedRef<AccessPermission[]> = computed(() => {
  if (accessConstraint.value.href == null) {
    return []
  }
  return decodeAccessConstraintPermissions(accessConstraint.value.href)
})

watch(
  () => accessRestriction.value,
  (newValue, oldValue) => {
    if (newValue == nullRestriction) {
      return
    }
    if (oldValue.slug === newValue.slug) {
      // needed when testing as we inject an emit which the relevant access component will also then repeat
      return
    }

    selectedSlug.value = newValue.slug
    emit('update:access', newValue)
    emit('update:isoAccess', accessConstraint.value)
  }
)
</script>

<template>
  <SectionBorder :type="SectionType.Element">
    <SectionTitle
      :type="SectionType.Element"
      version="2.1"
      :stability="Stability.Stable"
      anchor="access"
      title="Access Restrictions"
    />
    <TwoColumn>
      <template #left>
        <div class="space-y-2">
          <AccessAnonymous
            :selected-slug="selectedSlug"
            @update:access-restriction="(event: AccessRestriction) => (accessRestriction = event)"
          />
          <AccessNerc
            :selected-slug="selectedSlug"
            @update:access-restriction="(event: AccessRestriction) => (accessRestriction = event)"
          />
        </div>
      </template>
      <template #right>
        <div class="space-y-4">
          <div class="space-y-2">
            <p>Constraint:</p>
            <Output :data="accessConstraint"></Output>
          </div>
          <div class="space-y-2">
            <p>Permissions (URL/JSON decoded <code>constraint.href</code>):</p>
            <Output :data="accessPermissionsDecoded" :enable-copy="false"></Output>
          </div>
        </div>
      </template>
    </TwoColumn>
  </SectionBorder>
</template>
@/lib/constraints
