import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { ResourceType } from '@/types/enum'
import type { Identifier } from '@/types/iso'
import IdentifierAlias from '@/components/sections/elements/IdentifierAlias.vue'

describe('IdentifierAlias', () => {
  it('emits value when selected and filled in', async () => {
    const identifier = 'xxx'
    const expectedIdentifier: Identifier = {
      identifier: identifier,
      href: `https://data.bas.ac.uk/datasets/${identifier}`,
      namespace: 'alias.data.bas.ac.uk',
    }

    const wrapper = mount(IdentifierAlias, { props: { resourceType: ResourceType.Dataset } })

    // enable identifier
    await wrapper.find('input#identifier-alias-selection').setValue()

    // set identifier (needs to be after it's enabled)
    await wrapper.find('input#identifier-alias-value').setValue(identifier)

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      // the first event ([0]) is the initial value when the identifier is enabled so check the next
      expect(emittedIdentifier[1][0]).toEqual(expectedIdentifier)
    }
  })

  it("doesn't emit value when not selected", async () => {
    const wrapper = mount(IdentifierAlias, { props: { resourceType: ResourceType.Dataset } })

    const emittedIdentifier = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).not.toBeTruthy()
  })

  it('emits removal when selected and unselected', async () => {
    const wrapper = mount(IdentifierAlias, { props: { resourceType: ResourceType.Dataset } })

    // enable identifier
    await wrapper.find('input#identifier-alias-selection').setValue()

    const emittedIdentifierAdd = wrapper.emitted('add:identifier')
    expect(emittedIdentifierAdd).toBeTruthy()

    // disable identifier
    await wrapper.find('input#identifier-alias-selection').setValue(false)

    const emittedIdentifierRemove = wrapper.emitted('remove:identifier')
    expect(emittedIdentifierRemove).toBeTruthy()
  })

  it('has a disabled value input when not enabled', async () => {
    const wrapper = mount(IdentifierAlias, { props: { resourceType: ResourceType.Dataset } })

    const inputElement = wrapper.find('input#identifier-alias-value')
    expect(inputElement.attributes().disabled).toBe('')
  })
})
