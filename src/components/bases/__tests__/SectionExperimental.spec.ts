import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SectionExperimental from '@/components/bases/SectionExperimental.vue'

const expectedInitialText = 'Here be dragons 🏴󠁧󠁢󠁷󠁬󠁳󠁿'

describe('SectionExperimental', () => {
  it('renders initial content', async () => {
    const wrapper = mount(SectionExperimental)

    expect(wrapper.text()).toContain(expectedInitialText)
  })

  it('renders real content when clicked', async () => {
    const expectedRealText = '...'
    const wrapper = mount(SectionExperimental, { slots: { default: expectedRealText } })

    await wrapper.find('div.app-diagonalstripes-orange-100').trigger('click')

    expect(wrapper.text()).toContain(expectedRealText)
    expect(wrapper.text()).not.toContain(expectedInitialText)
  })
})
