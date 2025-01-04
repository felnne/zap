import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Clipboard from 'v-clipboard'

import Markdown from '@/components/bases/Markdown.vue'

const propDefaults = { inputClass: 'min-h-60' }

describe('Markdown', () => {
  it('renders properly with default classes', async () => {
    const wrapper = mount(Markdown, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('textarea').classes()).toContain(propDefaults.inputClass)
  })

  it('renders properly with an id attribute', async () => {
    const expected = 'foo'

    const wrapper = mount(Markdown, {
      props: { inputId: expected },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('textarea').attributes('id')).toBe(expected)
  })

  it('renders properly with non-default classes', async () => {
    const expected = 'min-h-20'

    const wrapper = mount(Markdown, {
      props: { inputClass: expected },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    expect(wrapper.find('textarea').classes()).toContain(expected)
    expect(wrapper.find('textarea').classes()).not.toContain(propDefaults.inputClass)
  })

  it('renders properly with initial input value', async () => {
    const expected = 'input'

    const wrapper = mount(Markdown, {
      props: { input: expected },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    // allow component to set textarea value
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toBe(expected)
  })

  it('renders properly with updated input value', async () => {
    const expected = 'input'

    const wrapper = mount(Markdown, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    // allow component to set textarea value (if set) to avoid false positive
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toBe('')

    // update input value
    wrapper.setProps({ input: expected })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').element.value).toBe(expected)
  })

  it('renders properly with pasted input', async () => {
    const expected = 'A\nB'
    const expectedJson = JSON.stringify(expected)

    const wrapper = mount(Markdown, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // trigger input paste event to trigger paste fix logic
    wrapper.find('textarea').element.value = expected
    wrapper.find('textarea').trigger('paste')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('textarea').element.value).toBe(expected)

    // set value normally to trigger reactivity
    wrapper.find('textarea').setValue(expected)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('textarea').element.value).toBe(expected)
    expect(wrapper.find('pre').text()).toBe(expectedJson)
  })

  it('emits input event on input', async () => {
    const expected = 'input'

    const wrapper = mount(Markdown, {
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })

    // update input value
    wrapper.find('textarea').setValue(expected)
    await wrapper.vm.$nextTick()

    const emittedInput = wrapper.emitted('update:input')
    expect(emittedInput).toBeTruthy()
    if (emittedInput) {
      expect(emittedInput[0]).toEqual([expected])
    }
  })

  it('renders derived outputs', async () => {
    const input = '# input\ntest input'
    const expectedMarkdown = '<h1>input</h1>'
    const expectedJson = input

    const wrapper = mount(Markdown, {
      props: { input: input },
      global: {
        directives: {
          clipboard: Clipboard,
        },
      },
    })
    // allow component to set textarea and derived output values
    await wrapper.vm.$nextTick()

    // markdown
    expect(wrapper.find('div.prose').html()).toContain(expectedMarkdown)
    expect(JSON.parse(wrapper.find('pre').text())).toBe(expectedJson)
  })
})
