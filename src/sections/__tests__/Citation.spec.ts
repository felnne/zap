import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { DateImpreciseLabelled } from '@/types/app'
import type { Identifier, PointOfContact as Contact } from '@/types/iso'
import Citation from '@/sections/Citation_v1_0.vue'

const defaultProps = {
  resourceType: 'dataset',
  identifiers: [
    { identifier: '123/12345', href: 'https://doi.org/123/12345', title: 'doi' }
  ] as Identifier[],
  edition: '1.0',
  dates: [
    { date: { js: new Date(2014, 0, 20), iso: '2014-01-20', precision: 'day' }, label: 'published' }
  ] as DateImpreciseLabelled[],
  contacts: [{ individual: { name: 'Watson, C.' } }] as Contact[],
  title: 'test'
}

describe('Citation', () => {
  it('renders properly', async () => {
    const wrapper = mount(Citation, {
      props: defaultProps,
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // getCitation() is async, so need to wait for it to resolve otherwise element will be empty
    await flushPromises()

    expect(wrapper.find('div#citation-preview').html()).toContain(`<i>${defaultProps.title}</i>`)
  })

  it('copies citation preview to input', async () => {
    const wrapper = mount(Citation, {
      props: defaultProps,
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    // getCitation() is async, so need to wait for it to resolve otherwise element will be empty
    await flushPromises()

    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toContain(`_${defaultProps.title}_`)
  })
})
