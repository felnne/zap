import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import DownloadFile from '@/components/sections/elements/DownloadFile.vue'

describe('DownloadFile', () => {
  it('renders correctly', async () => {
    const index = 1
    const fileIdentifier = 'x'
    const wrapper = mount(DownloadFile, {
      props: {
        index: index,
        fileIdentifier: fileIdentifier,
      },
    })

    // expect input to exist with id 'download-{expectedIndex}-file'
    expect(wrapper.find(`input#download-${index}-file`).exists()).toBeTruthy()
  })

  // Can't test file input works as vitest doesn't support file inputs

  // Can't test format determination, file upload and emits as they rely on file input changing
})
