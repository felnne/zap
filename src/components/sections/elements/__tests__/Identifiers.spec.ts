import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import { ResourceType } from '@/types/enum'
import type { Identifier } from '@/types/iso'
import { getLicence } from '@/lib/data'
import Identifiers from '@/components/sections/elements/Identifiers.vue'

const licence = getLicence('OGL_UK_3_0')

describe('Identifiers', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('adds an identifier and emits identifiers', async () => {
    const expectedIdentifier: Identifier = {
      identifier: 'x',
      href: 'y',
      namespace: 'z',
    }

    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset, licence: licence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'IdentifierSelf' })
    await childComponent.vm.$emit('add:identifier', expectedIdentifier)

    expect(wrapper.find('pre').text()).toContain(expectedIdentifier.namespace)

    const emittedIdentifier: unknown[][] | undefined = wrapper.emitted('update:identifiers')
    expect(emittedIdentifier).toBeTruthy()
    if (emittedIdentifier && emittedIdentifier[0]) {
      expect(emittedIdentifier[0][0]).toEqual([expectedIdentifier])
    }

    const emittedIsoIdentifier: unknown[][] | undefined = wrapper.emitted('update:isoIdentifiers')
    expect(emittedIsoIdentifier).toBeTruthy()
    if (emittedIsoIdentifier && emittedIsoIdentifier[0]) {
      expect(emittedIsoIdentifier[0][0]).toEqual([expectedIdentifier])
    }
  })

  it('removes an identifier', async () => {
    const expectedIdentifier: Identifier = {
      identifier: 'x',
      href: 'y',
      namespace: 'z',
    }

    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset, licence: licence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // check output is initially an empty list
    expect(wrapper.find('pre').text()).toBe(JSON.stringify([], null, 2))

    // add identifier (needs to use a component that also emits remove:identifier)
    const childComponent = wrapper.findComponent({ name: 'IdentifierDoi' })
    await childComponent.vm.$emit('add:identifier', expectedIdentifier)
    expect(wrapper.find('pre').text()).toContain(expectedIdentifier.namespace)

    // then remove it and check list is empty again
    await childComponent.vm.$emit('remove:identifier', expectedIdentifier)
    expect(wrapper.find('pre').text()).toBe(JSON.stringify([], null, 2))
  })

  it('updates an existing identifier', async () => {
    const expectedIdentifierA: Identifier = {
      identifier: 'x',
      href: 'y',
      namespace: '-',
    }

    const expectedIdentifierB: Identifier = {
      identifier: 'a',
      href: `b`,
      namespace: `-`,
    }

    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset, licence: licence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // initial identifier
    const childComponent = wrapper.findComponent({ name: 'IdentifierDoi' })
    await childComponent.vm.$emit('add:identifier', expectedIdentifierA)
    expect(wrapper.find('pre').text()).toContain(expectedIdentifierA.namespace)

    // then remove it and re-add it with a different value (but the same namespace)
    await childComponent.vm.$emit('remove:identifier', expectedIdentifierA)
    await childComponent.vm.$emit('add:identifier', expectedIdentifierB)

    expect(wrapper.find('pre').text()).toContain(expectedIdentifierB.identifier)
    expect(wrapper.find('pre').text()).not.toContain(expectedIdentifierA.identifier)
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})

describe('Identifiers (Integration)', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('hides DOI identifier based on publisher based on resource type', async () => {
    ;[ResourceType.Collection, ResourceType.Product].forEach((resourceType) => {
      const wrapper = mount(Identifiers, {
        props: { fileIdentifier: '', resourceType: resourceType, licence: licence },
        global: {
          directives: {
            clipboard: Clipboard,
          },
        },
      })

      const doiIdentifier = wrapper.findComponent({ name: 'IdentifierDoi' })
      expect(doiIdentifier.exists()).not.toBeTruthy()
    })
  })

  it('hides DOI identifier based on publisher based on licence type', async () => {
    const closedLicence = getLicence('X_OPERATIONS_MAPPING_1')
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '', resourceType: ResourceType.Dataset, licence: closedLicence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const doiIdentifier = wrapper.findComponent({ name: 'IdentifierDoi' })
    expect(doiIdentifier.exists()).not.toBeTruthy()
  })

  it('removes DOI identifier when publisher changes', async () => {
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '123', resourceType: ResourceType.Dataset, licence: licence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set the checkbox button with an id #identifier-doi-selection to selected
    await wrapper.find('input#identifier-doi-selection').setValue()
    expect(wrapper.find('pre').text()).toContain('https://doi.org/')

    // change the resource type, to change the publisher away from PDC, which should remove the DOI identifier
    await wrapper.setProps({ resourceType: ResourceType.Product })
    expect(wrapper.find('pre').text()).not.toContain('https://doi.org/')
  })

  it('toggling doi identifier updates output correctly', async () => {
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '123', resourceType: ResourceType.Dataset, licence: licence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set the checkbox button with an id #identifier-doi-selection to selected
    await wrapper.find('input#identifier-doi-selection').setValue()
    expect(wrapper.find('pre').text()).toContain('https://doi.org/')

    // set the checkbox button with an id #identifier-doi-selection to un-selected
    await wrapper.find('input#identifier-doi-selection').setValue(false)
    expect(wrapper.find('pre').text()).not.toContain('https://doi.org/')
  })

  it('toggling gitlab identifier updates output correctly', async () => {
    const wrapper = mount(Identifiers, {
      props: { fileIdentifier: '123', resourceType: ResourceType.Dataset, licence: licence },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set the checkbox button with an id #identifier-bas-gitlab-selection to selected
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue()
    expect(wrapper.find('pre').text()).toContain('gitlab.data.bas.ac.uk')

    // set the checkbox button with an id #identifier-bas-gitlab-selection to un-selected
    await wrapper.find('input#identifier-bas-gitlab-selection').setValue(false)
    expect(wrapper.find('pre').text()).not.toContain('gitlab.data.bas.ac.uk')
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
