import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { Identifier } from '@/types/iso'
import Identifiers from '@/sections/Identifiers.vue'

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
    const childComponent = wrapper.findComponent({ name: 'IdentifierSelf' })
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
    const childComponent = wrapper.findComponent({ name: 'IdentifierDoi' })
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
    const childComponent = wrapper.findComponent({ name: 'IdentifierDoi' })
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

      const doiIdentifier = wrapper.findComponent({ name: 'IdentifierDoi' })
      expect(doiIdentifier.exists()).toBeFalsy()

      const esriIdentifier = wrapper.findComponent({ name: 'IdentifierEsri' })
      expect(esriIdentifier.exists()).toBeFalsy()
    })
  })
})

describe('Identifiers (Integration)', () => {
  it('toggling doi identifier updates output correctly', async () => {
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '123', resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // set the checkbox button with an id #identifier-doi-selection to selected
    await wrapper.find('input#identifier-doi-selection').setValue()
    expect(wrapper.find('pre').text()).toContain('https://doi.org/')

    // set the checkbox button with an id #identifier-doi-selection to un-selected
    await wrapper.find('input#identifier-doi-selection').setValue(false)
    expect(wrapper.find('pre').text()).not.toContain('https://doi.org/')
  })

  it('toggling esri identifier updates output correctly', async () => {
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '123', resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // set the checkbox button with an id #identifier-esri-selection to selected
    await wrapper.find('input#identifier-esri-selection').setValue()
    expect(wrapper.find('pre').text()).toContain('https://bas.maps.arcgis.com')

    // set the checkbox button with an id #identifier-esri-selection to un-selected
    await wrapper.find('input#identifier-esri-selection').setValue(false)
    expect(wrapper.find('pre').text()).not.toContain('https://bas.maps.arcgis.com')
  })

  it('toggling gitlab identifier updates output correctly', async () => {
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '123', resourceType: ResourceType.Dataset },
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // set the checkbox button with an id #identifier-bas-gitlab-selection to selected
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue()
    expect(wrapper.find('pre').text()).toContain('https://gitlab.data.bas.ac.uk')

    // set the checkbox button with an id #identifier-bas-gitlab-selection to un-selected
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue(false)
    expect(wrapper.find('pre').text()).not.toContain('https://gitlab.data.bas.ac.uk')
  })
})
