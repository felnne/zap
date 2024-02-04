import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Services from '@/sections/Services.vue'

import servicesData from '@/data/services.json'

describe('Services', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders properly', async () => {
    const serviceSlugs: string[] = Object.keys(servicesData.services).sort((a: string, b: string) =>
      a.localeCompare(b)
    )

    const wrapper = mount(Services, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    serviceSlugs.every((service) =>
      expect(wrapper.find(`input#service-${service}-selection`).exists()).toBeTruthy()
    )
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
