import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { AccessRestriction } from '@/types/app'
import { getSetting } from '@/utils/data'
import AccessNerc from '@/sections/AccessNerc.vue'

const expectedAccessRestriction: AccessRestriction = {
  slug: 'nerc',
  restriction: 'restricted',
  label: 'Closed Access (NERC)',
  permissions: [
    {
      scheme: 'ms_graph',
      schemeVersion: '1',
      directoryId: getSetting('nerc_ad_tenant_id'),
      objectId: null,
    },
  ],
}

describe('AccessNerc', () => {
  it('emits value when selected', async () => {
    const wrapper = mount(AccessNerc, { props: { selectedSlug: 'not-nerc' } })

    // set radio input with id 'access-nerc' to checked
    await wrapper.find('input#access-nerc').setValue()

    const emittedAccessRestriction: unknown[][] | undefined = wrapper.emitted(
      'update:accessRestriction'
    )
    expect(emittedAccessRestriction).toBeTruthy()
    if (emittedAccessRestriction) {
      expect(emittedAccessRestriction[0][0]).toEqual(expectedAccessRestriction)
    }
  })

  it('emits value when reselected', async () => {
    const wrapper = mount(AccessNerc, { props: { selectedSlug: '-' } })

    // select initially
    await wrapper.find('input#access-nerc').setValue()
    const emittedAccessRestriction: unknown[][] | undefined = wrapper.emitted(
      'update:accessRestriction'
    )
    expect(emittedAccessRestriction).toBeTruthy()
    if (!emittedAccessRestriction) {
      return
    }
    expect(emittedAccessRestriction[0][0]).toEqual(expectedAccessRestriction)

    // update prop to a different value (deselect) and verify no event emitted
    const previousLength = emittedAccessRestriction.length
    await wrapper.setProps({ selectedSlug: 'not-nerc' })
    expect(emittedAccessRestriction.length).toEqual(previousLength)

    // reselect
    await wrapper.find('input#access-nerc').setValue()
    if (emittedAccessRestriction) {
      expect(emittedAccessRestriction[1][0]).toEqual(expectedAccessRestriction)
    }
  })
})
