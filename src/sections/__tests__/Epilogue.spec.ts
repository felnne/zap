import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import type { AppEnvironment } from '@/types/app'
import Epilogue from '@/sections/Epilogue.vue'

describe('Epilogue', () => {
  it('renders properly with minimal information', async () => {
    const minimalEnvironment: AppEnvironment = {
      mode: 'development'
    }
    const wrapper = mount(Epilogue, {props: {appEnv: minimalEnvironment}})

    expect(wrapper.find('#app-build-info').text()).toContain(minimalEnvironment.mode)
  })

  it('renders properly with full information', async () => {
    const maximumEnvironment: AppEnvironment = {
      mode: 'production',
      release: 'v0.6.0',
      commit: '1c0c6597176700465b8df44e1a78f9b9733a6818',
      time: '2024-01-05T12:59:51+00:00'
    }
    const wrapper = mount(Epilogue, {props: {appEnv: maximumEnvironment}})

    // expect 3 '/' in the rendered text
    const separatorCount = wrapper.find('#app-build-info').text().split('/').length -1;
    expect(separatorCount).toBe(3)

    expect(wrapper.find('#app-build-info').text()).toContain(maximumEnvironment.mode)
    expect(wrapper.find('#app-build-info').text()).toContain(maximumEnvironment.release)
    expect(wrapper.find('#app-build-info').text()).toContain(maximumEnvironment.commit?.substring(0, 8))
    expect(wrapper.find('#app-build-info').text()).toContain('2024-01-05 12:59:51Z')
  })
})
