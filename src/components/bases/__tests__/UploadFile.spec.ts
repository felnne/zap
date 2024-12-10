import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import UploadFile from '@/components/bases/UploadFile.vue'

const context = 'foo'
const fileIdentifier = 'x'

describe('UploadFile', () => {
  it('renders correctly with numeric identifier', async () => {
    const identifier = 1
    const wrapper = mount(UploadFile, {
      props: {
        context: context,
        identifier: identifier,
        fileIdentifier: fileIdentifier,
      },
    })

    // expect input to exist with id '{context}-{identifier}-file' (e.g. 'foo-1-file')
    expect(wrapper.find(`input#${context}-${identifier}-file`).exists()).toBeTruthy()
  })

  it('renders correctly with string identifier', async () => {
    const identifier = 'x'
    const wrapper = mount(UploadFile, {
      props: {
        context: context,
        identifier: identifier,
        fileIdentifier: fileIdentifier,
      },
    })

    // expect input to exist with id '{context}-{identifier}-file' (e.g. 'foo-x-file')
    expect(wrapper.find(`input#${context}-${identifier}-file`).exists()).toBeTruthy()
  })

  // Can't test file input works as vitest doesn't support file inputs

  // Can't test format determination, size, upload and emits - as they rely on file input changing
})
