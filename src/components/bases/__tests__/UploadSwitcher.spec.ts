import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { UploadSource } from '@/types/enum'

import DownloadSwitcher from '@/components/bases/UploadSwitcher.vue'

describe('UploadSwitcher', () => {
  it('emits expected upload source when each source picked', async () => {
    const wrapper = mount(DownloadSwitcher)

    let index = 0
    Object.values(UploadSource).forEach((source) => {
      // click the button with an id of `upload-${source}`
      wrapper.find(`button#upload-${source}`).trigger('click')

      const emittedSource: unknown[][] | undefined = wrapper.emitted('update:source')
      expect(emittedSource).toBeTruthy()
      if (emittedSource) {
        expect(emittedSource[index]![0]).toEqual(source)
      }

      index++
    })
  })
})
