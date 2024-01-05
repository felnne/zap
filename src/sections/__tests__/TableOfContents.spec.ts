import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { TocItem } from '@/types/app'
import TableOfContents from '@/sections/TableOfContents_v1_0.vue'

describe('TableOfContents', () => {
  it('renders properly', async () => {
    const items: TocItem[] = [
      { anchor: 'foo', title: 'Foo' },
      { anchor: 'bar', title: 'Bar' }
    ]

    const wrapper = mount(TableOfContents, { props: { items: items } })

    items.every((item) => expect(wrapper.find(`a[href="#${item.anchor}"]`).exists()).toBeTruthy())
  })
})
