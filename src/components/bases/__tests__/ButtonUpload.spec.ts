import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { UploadStatus } from '@/types/enum'
import ButtonUpload from '@/components/bases/ButtonUpload.vue'

describe('ButtonUpload', () => {
  it('renders properly in empty/initial state', () => {
    const wrapper = mount(ButtonUpload, {props: {state: UploadStatus.Empty}})
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('Upload')
  })

  it('renders properly in pending state', () => {
    const wrapper = mount(ButtonUpload, {props: {state: UploadStatus.Pending}})
    expect(wrapper.attributes().disabled).toBeUndefined()
    expect(wrapper.text()).toBe('Upload')
  })

  it('renders properly in uploading state', () => {
    const wrapper = mount(ButtonUpload, {props: {state: UploadStatus.Uploading}})
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('Uploading...')
  })

  it('renders properly in uploaded state', () => {
    const wrapper = mount(ButtonUpload, {props: {state: UploadStatus.Uploaded}})
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('Uploaded')
  })

  it('renders properly in error state', () => {
    const wrapper = mount(ButtonUpload, {props: {state: UploadStatus.Error}})
    expect(wrapper.attributes().disabled).not.toBeUndefined()
    expect(wrapper.text()).toBe('ERROR!')
  })
})
