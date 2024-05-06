import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { DropdownItem } from '@/types/app'

import DropDown from '@/components/bases/DropDown.vue'

const title = 'Title'
const expectedTitle = `${title} ▼`
const expectedItems: DropdownItem[] = [
  { title: 'Item 1', href: '#item1' },
  { title: 'Item 2', href: '#item2' },
]

describe('DropDown', () => {
  it('renders properly', async () => {
    const wrapper = mount(DropDown, {
      props: { title: title, items: expectedItems },
    })

    const trigger = wrapper.find('button')
    expect(trigger.text()).toBe(expectedTitle)

    // click trigger to open dropdown
    trigger.trigger('click')
    // wait for next tick to allow transition to complete
    await wrapper.vm.$nextTick()

    expectedItems.forEach((item) => {
      const link = wrapper.find(`a[href="${item.href}"]`)
      expect(link.exists()).toBe(true)
      expect(link.text()).toBe(item.title)
    })
  })

  it('renders properly with additional item classes', async () => {
    const itemClasses = ['block']

    const wrapper = mount(DropDown, {
      props: { title: title, items: expectedItems, itemClasses: itemClasses },
    })

    // click trigger to open dropdown
    wrapper.find('button').trigger('click')
    // wait for next tick to allow transition to complete
    await wrapper.vm.$nextTick()

    expect(wrapper.find(`a[href="${expectedItems[0].href}"]`).classes()).toContain(itemClasses[0])
  })
})
