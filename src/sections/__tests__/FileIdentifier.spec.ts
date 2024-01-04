import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import FileIdentifier from '@/sections/FileIdentifier.vue'

describe('FileIdentifier', () => {
  it('emits value when mounted', async () => {
    const uuidv4Regex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-4[0-9a-fA-F]{3}\b-[89abAB][0-9a-fA-F]{3}\b-[0-9a-fA-F]{12}\b$/

    const wrapper = mount(FileIdentifier, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    const emittedEdition: string[] | undefined = wrapper.emitted('update:fileIdentifier')
    expect(emittedEdition).toBeTruthy()
    if (emittedEdition) {
      expect(uuidv4Regex.test(emittedEdition[0])).toBe(true)
    }
  })
})
