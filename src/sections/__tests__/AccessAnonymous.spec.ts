import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { AccessRestriction } from '@/types/app'
import AccessAnonymous from '@/sections/AccessAnonymous.vue'

const expectedAccessRestriction: AccessRestriction = {
  slug: 'anonymous',
  restriction: 'unrestricted',
  label: 'Open Access (Anonymous)',
  permissions: [],
}

describe('AccessAnonymous', () => {
  it('emits value when mounted', async () => {
    const wrapper = mount(AccessAnonymous, { props: { selectedSlug: 'anonymous' } })

    // wait for watcher to fire
    await wrapper.vm.$nextTick()

    const emittedAccessRestriction: unknown[][] | undefined = wrapper.emitted(
      'update:accessRestriction'
    )
    expect(emittedAccessRestriction).toBeTruthy()
    if (emittedAccessRestriction) {
      expect(emittedAccessRestriction[0][0]).toEqual(expectedAccessRestriction)
    }
  })

  it('emits value when reselected', async () => {
    const wrapper = mount(AccessAnonymous, { props: { selectedSlug: 'anonymous' } })

    // wait for watcher to fire and emit initial event
    await wrapper.vm.$nextTick()
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
    await wrapper.setProps({ selectedSlug: 'not-anonymous' })
    expect(emittedAccessRestriction.length).toEqual(previousLength)

    // reselect
    await wrapper.find('input#access-anonymous').setValue()
    if (emittedAccessRestriction) {
      expect(emittedAccessRestriction[1][0]).toEqual(expectedAccessRestriction)
    }
  })
})
