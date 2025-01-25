import { afterEach, beforeEach, describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import type { PhysicalDimensions } from '@/types/app'
import { getPhysicalSizes } from '@/lib/data'
import PhysicalSize from '@/components/sections/elements/PhysicalSize.vue'

const physicalSizes = getPhysicalSizes()

describe('PhysicalSize', () => {
  let tocItemsDiv: HTMLDivElement

  beforeEach(() => {
    // TOC link in section title will be teleported into a '#toc-items-element' element so create a fake one to stop warnings
    tocItemsDiv = document.createElement('div')
    tocItemsDiv.id = 'toc-items-element'
    document.body.appendChild(tocItemsDiv)
  })

  it('does not emit value when mounted', async () => {
    const wrapper = mount(PhysicalSize, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    const emittedDimensions: unknown[][] | undefined = wrapper.emitted('update:dimensions')
    expect(emittedDimensions).not.toBeTruthy()
  })

  it('emits value when updated', async () => {
    const initialDimensions: PhysicalDimensions = {
      width: physicalSizes[0].width_mm,
      height: physicalSizes[0].height_mm,
    }
    const updatedDimensions: PhysicalDimensions = {
      width: physicalSizes[1].width_mm,
      height: physicalSizes[1].height_mm,
    }

    const wrapper = mount(PhysicalSize, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'size-iso_a4_portrait' to checked
    await wrapper.find('input#size-iso_a4_portrait').setValue()

    // initial value
    const emittedDimensions: unknown[][] | undefined = wrapper.emitted('update:dimensions')
    expect(emittedDimensions).toBeTruthy()
    if (emittedDimensions) {
      expect(emittedDimensions[0][0]).toEqual(initialDimensions)
    }

    // set radio input with id 'size-iso_a4_landscape' to checked
    await wrapper.find('input#size-iso_a4_landscape').setValue()

    // updated value
    if (emittedDimensions) {
      expect(emittedDimensions[1][0]).toEqual(updatedDimensions)
    }
  })

  it('emits value for custom size choice', async () => {
    const customDimensions: PhysicalDimensions = { width: 100, height: 200 }

    const wrapper = mount(PhysicalSize, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // set radio input with id 'size-custom' to checked
    await wrapper.find('input#size-custom').setValue()
    await wrapper.find('input#size-width').setValue(customDimensions.width)
    await wrapper.find('input#size-height').setValue(customDimensions.height)

    const emittedDimensions: unknown[][] | undefined = wrapper.emitted('update:dimensions')
    expect(emittedDimensions).toBeTruthy()
    if (emittedDimensions) {
      expect(emittedDimensions[emittedDimensions.length - 1][0]).toEqual(customDimensions)
    }
  })

  afterEach(() => {
    // clean up '#toc-items' element
    document.body.removeChild(tocItemsDiv)
  })
})
