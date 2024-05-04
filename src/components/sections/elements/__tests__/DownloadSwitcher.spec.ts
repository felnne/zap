import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { DownloadType } from '@/types/enum'

import DownloadSwitcher from '@/components/sections/elements/DownloadSwitcher.vue'

describe('DownloadSwitcher', () => {
  it('emits expected download type when each type picked', async () => {
    const wrapper = mount(DownloadSwitcher)

    let index = 0
    Object.values(DownloadType).forEach((downloadType) => {
      // click the button with an id of `download-${downloadType}`
      wrapper.find(`button#download-${downloadType}`).trigger('click')

      const emittedType: unknown[][] | undefined = wrapper.emitted('update:type')
      expect(emittedType).toBeTruthy()
      if (emittedType) {
        expect(emittedType[index][0]).toEqual(downloadType)
      }

      index++
    })
  })
})
