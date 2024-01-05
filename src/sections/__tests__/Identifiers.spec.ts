import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { Identifier } from '@/types/iso'
import Identifiers from '@/sections/Identifiers_v2_0.vue'

describe('Identifiers', () => {
  it('adds an identifier and emits identifiers', async () => {
    const expectedIdentifier: Identifier = {
      identifier: 'x',
      href: 'y',
      title: 'z'
    }

    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'IdentifierSelf_v1_1' })
    await childComponent.vm.$emit('add:identifier', expectedIdentifier)

    expect(wrapper.find('pre').text()).toContain(expectedIdentifier.title)

    const emittedIdentifier = wrapper.emitted('update:identifiers')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier) {
      expect(emittedIdentifier[0]).toEqual([[expectedIdentifier]])
    }
  })

  it('removes an identifier', async () => {
    const expectedIdentifier: Identifier = {
      identifier: 'x',
      href: 'y',
      title: 'z'
    }

    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // check output is initially an empty list
    expect(wrapper.find('pre').text()).toBe(JSON.stringify([], null, 2))

    // add identifier (needs to use a component that also emits remove:identifier)
    const childComponent = wrapper.findComponent({ name: 'IdentifierDoi_v1_1' })
    await childComponent.vm.$emit('add:identifier', expectedIdentifier)
    expect(wrapper.find('pre').text()).toContain(expectedIdentifier.title)

    // then remove it and check list is empty again
    await childComponent.vm.$emit('remove:identifier', expectedIdentifier)
    expect(wrapper.find('pre').text()).toBe(JSON.stringify([], null, 2))
  })

  it('updates an existing identifier', async () => {
    const expectedIdentifierA: Identifier = {
      identifier: 'x',
      href: 'y',
      title: '-'
    }

    const expectedIdentifierB: Identifier = {
      identifier: 'a',
      href: `b`,
      title: `-`
    }

    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // initial identifier
    const childComponent = wrapper.findComponent({ name: 'IdentifierDoi_v1_1' })
    await childComponent.vm.$emit('add:identifier', expectedIdentifierA)
    expect(wrapper.find('pre').text()).toContain(expectedIdentifierA.title)

    // then remove it and re-add it with a different value (but the same title (namespace))
    await childComponent.vm.$emit('remove:identifier', expectedIdentifierA)
    await childComponent.vm.$emit('add:identifier', expectedIdentifierB)

    expect(wrapper.find('pre').text()).toContain(expectedIdentifierB.identifier)
    expect(wrapper.find('pre').text()).not.toContain(expectedIdentifierA.identifier)
  })

  it('hides identifiers based on resource type', async () => {
    ;[ResourceType.Collection, ResourceType.Product].forEach((resourceType) => {
      const wrapper = mount(Identifiers, {
        props: { fileIdentifier: '', resourceType: resourceType },
        global: {
          directives: {
            clipboard: Clipboard
          }
        }
      })

      const doiIdentifier = wrapper.findComponent({ name: 'IdentifierDoi_v1_1' })
      expect(doiIdentifier.exists()).toBeFalsy()

      const esriIdentifier = wrapper.findComponent({ name: 'IdentifierEsri_v1_1' })
      expect(esriIdentifier.exists()).toBeFalsy()
    })
  })
})
