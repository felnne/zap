import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { GraphicOverview as IsoGraphicOverview } from '@/types/iso'
import { getFormatByType } from '@/lib/data'

import Thumbnails from '@/components/sections/elements/Thumbnails.vue'

const fileIdentifier = 'x'
const expectedOverview: IsoGraphicOverview = {
  identifier: 'overview',
  description: 'General overview of resource',
  href: 'https://example.com/image.png',
  mime_type: getFormatByType('image/png')!.mediaTypes![0]!,
}

describe('Thumbnails', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('clicking thumbnail type button adds a new thumbnail', async () => {
    const wrapper = mount(Thumbnails, {
      props: {
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click thumbnail type button
    await wrapper.find('button#add-thumbnail-overview').trigger('click')

    // check a thumbnail element is rendered
    expect(wrapper.find('#thumbnail-overview').exists()).toBeTruthy()
  })

  it('thumbnail type button is disabled after clicking', async () => {
    const wrapper = mount(Thumbnails, {
      props: {
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click thumbnail type button
    await wrapper.find('button#add-thumbnail-overview').trigger('click')

    // same thumbnail type button is now disabled
    const button = wrapper.find('button#add-thumbnail-overview')
    expect(button.attributes().disabled).toBe('')
  })

  it('thumbnail type button is re-enabled after destroying previous instance', async () => {
    const wrapper = mount(Thumbnails, {
      props: {
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click thumbnail type button
    await wrapper.find('button#add-thumbnail-overview').trigger('click')

    // destroy thumbnail type
    const childComponent = wrapper.findComponent({ name: 'Thumbnail' })
    await childComponent.vm.$emit('destroy')

    // same thumbnail type button is enabled
    const button = wrapper.find('button#add-thumbnail-overview')
    expect(button.attributes().disabled).toBeUndefined()
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})

describe('Thumbnails [Integration]', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('renders a graphic overview if file upload type picked', async () => {
    const wrapper = mount(Thumbnails, {
      props: {
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // click thumbnail type button
    await wrapper.find('button#add-thumbnail-overview').trigger('click')

    // click file upload source
    await wrapper.find('button#upload-file').trigger('click')

    // check a file upload element is rendered
    expect(wrapper.find('#thumbnail-overview-file').exists()).toBeTruthy()
  })

  it('renders and emits a graphicOverview', async () => {
    const wrapper = mount(Thumbnails, {
      props: {
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // add thumbnail
    await wrapper.find('button#add-thumbnail-overview').trigger('click')

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'Thumbnail' })
    await childComponent.vm.$emit('update:isoGraphicOverview', expectedOverview)

    expect(wrapper.find('#thumbnails-output pre').text()).toBe(
      JSON.stringify([expectedOverview], null, 2)
    )

    const emittedIsoGraphicOverviews: unknown[][] | undefined = wrapper.emitted(
      'update:isoGraphicOverviews'
    )
    expect(emittedIsoGraphicOverviews).toBeTruthy()
    if (emittedIsoGraphicOverviews && emittedIsoGraphicOverviews[0]) {
      expect(emittedIsoGraphicOverviews[0][0]).toEqual([expectedOverview])
    }
  })

  it('removes a download and emits updated graphicOverviews', async () => {
    const wrapper = mount(Thumbnails, {
      props: {
        fileIdentifier: fileIdentifier,
      },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // add thumbnail
    await wrapper.find('button#add-thumbnail-overview').trigger('click')

    // simulate event from child component
    const childComponent = wrapper.findComponent({ name: 'Thumbnail' })
    await childComponent.vm.$emit('update:isoGraphicOverview', expectedOverview)
    const emittedIsoGraphicOverviews: unknown[][] | undefined = wrapper.emitted(
      'update:isoGraphicOverviews'
    )
    expect(emittedIsoGraphicOverviews).toBeTruthy()
    if (emittedIsoGraphicOverviews && emittedIsoGraphicOverviews[0]) {
      expect(emittedIsoGraphicOverviews[0][0]).toEqual([expectedOverview])
    }

    // simulate destroy event from child component
    await childComponent.vm.$emit('destroy')
    expect(emittedIsoGraphicOverviews).toBeTruthy()
    if (emittedIsoGraphicOverviews && emittedIsoGraphicOverviews[1]) {
      expect(emittedIsoGraphicOverviews[1][0]).toEqual([])
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
