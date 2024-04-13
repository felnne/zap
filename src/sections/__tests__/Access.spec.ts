import { afterEach, beforeEach, describe, it, expect } from 'vitest'
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
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

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

    const emittedIsoAccess: unknown[][] | undefined = wrapper.emitted('update:isoAccess')
    expect(emittedIsoAccess).toBeTruthy()
    if (emittedIsoAccess) {
      expect(emittedIsoAccess[0][0]).toEqual(expectedConstraint)
    }
  })

  it('updates and emits when access restriction changes', async () => {
    const expectedInitialRestriction = expectedRestriction
    const expectedInitialConstraint = expectedConstraint

    const expectedUpdatedRestriction: AccessRestriction = {
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
    const expectedUpdatedConstraint = createAccessConstraint(expectedUpdatedRestriction)

    const wrapper = mount(Access, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // wait for initially selected restriction to be rendered
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('pre')[0].text()).toContain(expectedInitialRestriction.label)
    const emittedAccess: unknown[][] | undefined = wrapper.emitted('update:access')
    expect(emittedAccess).toBeTruthy()
    if (emittedAccess) {
      expect(emittedAccess[0][0]).toEqual(expectedInitialRestriction)
    }
    const emittedIsoAccess: unknown[][] | undefined = wrapper.emitted('update:isoAccess')
    expect(emittedIsoAccess).toBeTruthy()
    if (emittedIsoAccess) {
      expect(emittedIsoAccess[0][0]).toEqual(expectedInitialConstraint)
    }

    // simulate event from child component representing updated selection
    const updatedComponent = wrapper.findComponent({ name: 'AccessNerc' })
    await updatedComponent.vm.$emit('update:accessRestriction', expectedUpdatedRestriction)

    expect(wrapper.findAll('pre')[0].text()).toContain(expectedUpdatedRestriction.label)
    if (emittedAccess) {
      expect(emittedAccess[1][0]).toEqual(expectedUpdatedRestriction)
    }
    if (emittedIsoAccess) {
      expect(emittedIsoAccess[1][0]).toEqual(expectedUpdatedConstraint)
    }

    // flip back and forth some more to ensure inputs can be reselected not just selected once

    const initialComponent = wrapper.findComponent({ name: 'AccessAnonymous' })
    await initialComponent.vm.$emit('update:accessRestriction', expectedInitialRestriction)
    expect(wrapper.findAll('pre')[0].text()).toContain(expectedInitialRestriction.label)
    if (emittedAccess) {
      expect(emittedAccess[2][0]).toEqual(expectedInitialRestriction)
    }
    if (emittedIsoAccess) {
      expect(emittedIsoAccess[2][0]).toEqual(expectedInitialConstraint)
    }

    await updatedComponent.vm.$emit('update:accessRestriction', expectedUpdatedRestriction)
    expect(wrapper.findAll('pre')[0].text()).toContain(expectedUpdatedRestriction.label)
    if (emittedAccess) {
      expect(emittedAccess[3][0]).toEqual(expectedUpdatedRestriction)
    }
    if (emittedIsoAccess) {
      expect(emittedIsoAccess[3][0]).toEqual(expectedUpdatedConstraint)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
