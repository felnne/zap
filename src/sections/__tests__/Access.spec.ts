import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { AccessRestriction } from '@/types/app'
import type { Constraint } from '@/types/iso'
import { getSetting } from '@/utils/data'
import { createAccessConstraint } from '@/utils/constraints'
import Access from '@/sections/Access.vue'

const expectedRestriction: AccessRestriction = {
  slug: 'anonymous',
  restriction: 'unrestricted',
  label: 'Open Access (Anonymous)',
  permissions: [],
}
const expectedConstraint: Constraint = createAccessConstraint(expectedRestriction)

describe('Access', () => {
  it('renders and emits access constraint when restriction selected', async () => {
    const wrapper = mount(Access, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'AccessAnonymous' })
    await childComponent.vm.$emit('update:accessRestriction', expectedRestriction)

    // main output is first pre element
    expect(wrapper.findAll('pre')[0].text()).toBe(JSON.stringify(expectedConstraint, null, 2))
    // decoded permissions is second pre element
    expect(wrapper.findAll('pre')[1].text()).toBe(JSON.stringify([], null, 2))

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('update:access')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      expect(emittedIdentifier[0][0]).toEqual(expectedRestriction)
    }
  })

  it('updates when access restriction changes', async () => {
    const initialRestriction = expectedRestriction
    const updatedRestriction: AccessRestriction = {
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

    const wrapper = mount(Access, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from child component representing initial selection
    const initialComponent = wrapper.findComponent({ name: 'AccessAnonymous' })
    await initialComponent.vm.$emit('update:accessRestriction', initialRestriction)
    expect(wrapper.findAll('pre')[0].text()).toContain(initialRestriction.label)

    // simulate event from child component representing updated selection
    const updatedComponent = wrapper.findComponent({ name: 'AccessNerc' })
    await updatedComponent.vm.$emit('update:accessRestriction', updatedRestriction)
    expect(wrapper.findAll('pre')[0].text()).toContain(updatedRestriction.label)

    // do again to ensure inputs can be reselected not just selected once
    await initialComponent.vm.$emit('update:accessRestriction', initialRestriction)
    expect(wrapper.findAll('pre')[0].text()).toContain(initialRestriction.label)
    await updatedComponent.vm.$emit('update:accessRestriction', updatedRestriction)
    expect(wrapper.findAll('pre')[0].text()).toContain(updatedRestriction.label)
  })
})
