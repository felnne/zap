import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { Idea as IdeaT } from '@/types/app'
import Idea from '@/components/sections/info/Idea.vue'

const label = 'My big idea'

describe('Idea', () => {
  it('renders properly when todo', async () => {
    const idea: IdeaT = { label: label, state: 'todo' }
    const wrapper = mount(Idea, { props: { idea: idea } })

    expect(wrapper.text()).toContain(label)
  })

  it('renders properly when completed', async () => {
    const idea: IdeaT = { label: label, state: 'complete' }
    const wrapper = mount(Idea, { props: { idea: idea } })

    expect(wrapper.text()).toContain('Done')
  })

  it('renders properly when cancelled', async () => {
    const idea: IdeaT = { label: label, state: 'cancelled' }
    const wrapper = mount(Idea, { props: { idea: idea } })

    expect(wrapper.text()).toContain('Cancelled')
  })
})
