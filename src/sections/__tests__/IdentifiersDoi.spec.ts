import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { v4 as uuidv4 } from 'uuid'

import type { Identifier } from '@/types/iso'
import IdentifierDoi from '@/sections/IdentifierDoi.vue'

const uuid = uuidv4()

describe('IdentifierDoi', () => {
  it('emits value when updated and selected', async () => {
    const fileIdentifier = uuid
    const expectedIdentifierValue = `10.5285/${fileIdentifier}`
    const expectedIdentifier: Identifier = {
      identifier: expectedIdentifierValue,
      href: `https://doi.org/${expectedIdentifierValue}`,
      namespace: 'doi',
    }

    const wrapper = mount(IdentifierDoi, { props: { fileIdentifier: '' } })

    await wrapper.setProps({ fileIdentifier: fileIdentifier })

    // enable identifier
    await wrapper.find(`input#identifier-doi-selection`).setValue()

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      expect(emittedIdentifier[0][0]).toEqual(expectedIdentifier)
    }
  })

  it("doesn't emit value when not selected", async () => {
    const wrapper = mount(IdentifierDoi, { props: { fileIdentifier: '' } })

    await wrapper.setProps({ fileIdentifier: uuid })

    const emittedIdentifier = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).not.toBeTruthy()
  })

  it('emits removal when updated, selected and unselected', async () => {
    const wrapper = mount(IdentifierDoi, { props: { fileIdentifier: '' } })
    await wrapper.setProps({ fileIdentifier: 'x' })

    // enable identifier
    await wrapper.find(`input#identifier-doi-selection`).setValue()

    const emittedIdentifierAdd = wrapper.emitted('add:identifier')
    expect(emittedIdentifierAdd).toBeTruthy()

    // disable identifier
    await wrapper.find(`input#identifier-doi-selection`).setValue(false)

    const emittedIdentifierRemove = wrapper.emitted('remove:identifier')
    expect(emittedIdentifierRemove).toBeTruthy()
  })
})
