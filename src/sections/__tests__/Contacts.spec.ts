import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { Individual } from '@/types/app'
import type { PointOfContact as Contact } from '@/types/iso'
import Contacts from '@/sections/Contacts.vue'

import individualsData from '@/data/individuals.json'

describe('Contacts', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders individuals as choices', async () => {
    const expectedIndividuals: Individual[] = Object.values(individualsData.contacts)

    const wrapper = mount(Contacts, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expectedIndividuals.every((person) =>
      expect(wrapper.find(`input#individual-${person.slug}`).exists()).toBeTruthy()
    )
  })

  it('renders contact for single choice', async () => {
    const individual: Individual = Object.values(individualsData.contacts)[0]

    const wrapper = mount(Contacts, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'individual-0000-0001-5835-7975' to checked
    await wrapper.find(`input#individual-${individual.slug}`).setValue()

    expect(wrapper.find('pre').text()).toContain(individual.name)
  })

  it('renders contacts for multiple choices', async () => {
    const individualA: Individual = Object.values(individualsData.contacts)[0]
    const individualB: Individual = Object.values(individualsData.contacts)[1]
    const individualC: Individual = Object.values(individualsData.contacts)[2]

    const wrapper = mount(Contacts, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set first two contacts to checked
    await wrapper.find(`input#individual-${individualA.slug}`).setValue()
    await wrapper.find(`input#individual-${individualB.slug}`).setValue()
    expect(wrapper.find('pre').text()).toContain(individualA.name)
    expect(wrapper.find('pre').text()).toContain(individualB.name)
    expect(wrapper.find('pre').text()).not.toContain(individualC.name)

    // set third contact to checked and uncheck first contact
    await wrapper.find(`input#individual-${individualC.slug}`).setValue()
    await wrapper.find(`input#individual-${individualA.slug}`).setValue(false)
    expect(wrapper.find('pre').text()).not.toContain(individualA.name)
    expect(wrapper.find('pre').text()).toContain(individualB.name)
    expect(wrapper.find('pre').text()).toContain(individualC.name)
  })

  it('emits value when updated', async () => {
    const individualA: Individual = Object.values(individualsData.contacts)[0]
    const individualB: Individual = Object.values(individualsData.contacts)[1]

    const wrapper = mount(Contacts, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    await wrapper.find(`input#individual-${individualA.slug}`).setValue()
    await wrapper.vm.$nextTick()

    const emittedContacts = wrapper.emitted('update:contacts') as Contact[][][]
    expect(emittedContacts).toBeTruthy()
    if (emittedContacts[0]) {
      expect(emittedContacts[0][0][0]?.individual?.name).toEqual(individualA.name)
    }

    // update selection, entirely replacing previous selection
    await wrapper.find(`input#individual-${individualB.slug}`).setValue()
    await wrapper.find(`input#individual-${individualA.slug}`).setValue(false)
    await wrapper.vm.$nextTick()

    if (emittedContacts[2]) {
      expect(emittedContacts[2][0][0]?.individual?.name).toEqual(individualB.name)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
