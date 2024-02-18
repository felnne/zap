import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { Identifier } from '@/types/iso'
import IdentifierEsri from '@/sections/IdentifierEsri.vue'

describe('IdentifierEsri', () => {
  it('emits value when selected and filled in', async () => {
    const identifier = '1234'
    const account = 'bas'
    const expectedIdentifier: Identifier = {
      identifier: identifier,
      href: `https://${account}.maps.arcgis.com/home/item.html?id=${identifier}`,
      namespace: `${account}.maps.arcgis.com`,
    }

    const wrapper = mount(IdentifierEsri)

    // enable identifier
    await wrapper.find('input#identifier-esri-selection').setValue()

    // set identifier (needs to be after it's enabled)
    await wrapper.find('input#identifier-esri-id').setValue(identifier)

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      // the first event ([0]) is the initial value when the identifier is enabled so check the next
      expect(emittedIdentifier[1][0]).toEqual(expectedIdentifier)
    }
  })

  it("doesn't emit value when not selected", async () => {
    const wrapper = mount(IdentifierEsri)

    const emittedIdentifier = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).not.toBeTruthy()
  })

  it('emits removal when selected and unselected', async () => {
    const wrapper = mount(IdentifierEsri)

    // enable identifier
    await wrapper.find('input#identifier-esri-selection').setValue()

    const emittedIdentifierAdd = wrapper.emitted('add:identifier')
    expect(emittedIdentifierAdd).toBeTruthy()

    // disable identifier
    await wrapper.find('input#identifier-esri-selection').setValue(false)

    const emittedIdentifierRemove = wrapper.emitted('remove:identifier')
    expect(emittedIdentifierRemove).toBeTruthy()
  })

  it('has a disabled value input when not enabled', async () => {
    const wrapper = mount(IdentifierEsri)

    const inputElement = wrapper.find('input#identifier-esri-id')
    expect(inputElement.attributes().disabled).toBe('')
  })
})
