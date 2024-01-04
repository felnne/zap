import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Title from '@/sections/Title.vue'

describe('Title', () => {
  it('emits value when updated', async () => {
    const expectedUpdated = 'Title'

    const wrapper = mount(Title, {
      global: {
        directives: {
          clipboard: Clipboard
        }
      }
    })

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(expectedUpdated)
    expect(inputElement.element.value).toBe(expectedUpdated)

    await wrapper.vm.$nextTick()
    const emittedTitle = wrapper.emitted('update:title')
    expect(emittedTitle).toBeTruthy()
    if (emittedTitle) {
      expect(emittedTitle[0]).toEqual([expectedUpdated])
    }
  })
})
