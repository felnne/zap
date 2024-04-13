import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { v4 as uuidv4 } from 'uuid'

import type { Identifier } from '@/types/iso'
import IdentifierSelf from '@/components/sections/elements/IdentifierSelf.vue'

const uuid = uuidv4()

describe('IdentifierSelf', () => {
  it('emits value when updated', async () => {
    const expectedIdentifierValue = uuid
    const expectedIdentifier: Identifier = {
      identifier: expectedIdentifierValue,
      href: `https://data.bas.ac.uk/items/${expectedIdentifierValue}`,
      namespace: 'data.bas.ac.uk',
    }

    const wrapper = mount(IdentifierSelf, { props: { fileIdentifier: '' } })

    await wrapper.setProps({ fileIdentifier: expectedIdentifierValue })

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('add:identifier')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      expect(emittedIdentifier[0][0]).toEqual(expectedIdentifier)
    }
  })
})
