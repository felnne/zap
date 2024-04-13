import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Prose from '@/components/bases/Prose.vue'

const propDefaults = { proseClasses: ['lg:prose-lg'], borderColourClass: 'border-sky-500' }

describe('Prose', () => {
  it('renders properly with default classes', async () => {
    const html = '<h1>Foo</h1>'
    const expectedClasses = [...propDefaults.proseClasses, propDefaults.borderColourClass]

    const wrapper = mount(Prose, {
      props: { content: html },
    })

    expect(wrapper.find('div').html()).toContain(html)

    const divClasses = wrapper.find('div').classes()
    expectedClasses.every((expectedClass) => expect(divClasses).toContain(expectedClass))
  })

  it('renders properly with non-default classes', async () => {
    const html = '<h1>Foo</h1>'
    const proseClasses = ['prose-sm']
    const borderColourClass = 'border-neutral-500'
    const expectedClasses = [...proseClasses, borderColourClass]
    const unexpectedClasses = [...propDefaults.proseClasses, propDefaults.borderColourClass]

    const wrapper = mount(Prose, {
      props: { content: html, proseClasses: proseClasses, borderColourClass: borderColourClass },
    })

    expect(wrapper.find('div').html()).toContain(html)

    const divClasses = wrapper.find('div').classes()
    expectedClasses.every((expectedClass) => expect(divClasses).toContain(expectedClass))
    unexpectedClasses.every((unexpectedClass) => expect(divClasses).not.toContain(unexpectedClass))
  })
})
