import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Summary from '@/components/sections/elements/Summary.vue'

const summariseFromAbstractMockValue = 'test'
vi.mock('@/lib/ai', () => ({
  summariseAbstract: vi.fn().mockResolvedValue('test'),
}))

describe('Summary', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('emits value when updated', async () => {
    const expectedUpdated = 'Summary'

    const wrapper = mount(Summary, {
      props: {
        abstract: '',
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(expectedUpdated)
    expect(inputElement.element.value).toBe(expectedUpdated)

    await wrapper.vm.$nextTick()

    const emittedSummary: unknown[][] | undefined = wrapper.emitted('update:summary')
    expect(emittedSummary).toBeTruthy()
    if (emittedSummary && emittedSummary[0]) {
      expect(emittedSummary[0][0]).toEqual(expectedUpdated)
    }

    const emittedIsoValuePurpose: unknown[][] | undefined = wrapper.emitted('update:isoPurpose')
    expect(emittedIsoValuePurpose).toBeTruthy()
    if (emittedIsoValuePurpose && emittedIsoValuePurpose[0]) {
      expect(emittedIsoValuePurpose[0][0]).toEqual(expectedUpdated)
    }
  })

  it('copy from abstract button works', async () => {
    const expectedValue = 'test'

    const wrapper = mount(Summary, {
      props: {
        abstract: expectedValue,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('#summary-use-abstract').attributes()).not.toHaveProperty('disabled')
    await wrapper.find('#summary-use-abstract').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toContain(expectedValue)
  })

  it('summarise from abstract button works', async () => {
    const wrapper = mount(Summary, {
      props: {
        abstract: summariseFromAbstractMockValue,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('#summary-use-abstract-ai').attributes()).not.toHaveProperty('disabled')
    await wrapper.find('#summary-use-abstract-ai').trigger('click')
    await wrapper.vm.$nextTick()

    // summariseFromAbstract() is async, so need to wait for it to resolve otherwise element will be empty
    await flushPromises()

    expect(wrapper.find('textarea').element.value).toBe(summariseFromAbstractMockValue)
    expect(wrapper.find('textarea').element.value).not.toContain('[Error generating summary]')
  })

  it('copy from abstract buttons are disabled when abstract empty', async () => {
    const wrapper = mount(Summary, {
      props: {
        abstract: '',
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('#summary-use-abstract').exists()).toBeTruthy()
    expect(wrapper.find('#summary-use-abstract').attributes()).toHaveProperty('disabled')

    expect(wrapper.find('#summary-use-abstract-ai').exists()).toBeTruthy()
    expect(wrapper.find('#summary-use-abstract-ai').attributes()).toHaveProperty('disabled')
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
