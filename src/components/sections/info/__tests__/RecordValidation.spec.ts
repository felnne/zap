import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { emptyIsoRecord } from '@/lib/record'
import { supportedRecord } from '@/lib/__tests__/_validation_data'
import RecordValidation from '@/components/sections/info/RecordValidation.vue'

describe('RecordValidation', () => {
  it('renders correctly when empty', async () => {
    const wrapper = mount(RecordValidation)

    expect(wrapper.find('#validation-message').exists()).not.toBeTruthy()
    expect(wrapper.find('#validation-errors').exists()).not.toBeTruthy()
  })

  it('renders correctly with non-parsable user input ', async () => {
    const input = 'x'

    const wrapper = mount(RecordValidation)

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(input)

    expect(wrapper.find('#validation-message').text()).toEqual(
      '😕 Record cannot be understood (invalid format).'
    )
    expect(wrapper.find('#validation-errors').exists()).not.toBeTruthy()
  })

  it('renders correctly with valid user input ', async () => {
    const record = {
      $schema:
        'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
      hierarchy_level: 'dataset',
      metadata: {
        language: 'eng',
        character_set: 'utf-8',
        contacts: [{ organisation: { name: 'UK Polar Data Centre' }, role: ['pointOfContact'] }],
        date_stamp: '2018-10-18',
      },
      identification: {
        title: { value: 'Test Record' },
        dates: { creation: '2018' },
        abstract:
          'Test Record for ISO 19115 metadata standard (no profile) with required properties only.',
        character_set: 'utf-8',
        language: 'eng',
        topics: ['environment', 'climatologyMeteorologyAtmosphere'],
        extents: [
          {
            identifier: 'bounding',
            geographic: {
              bounding_box: {
                west_longitude: -45.61521,
                east_longitude: -27.04976,
                south_latitude: -68.1511,
                north_latitude: -54.30761,
              },
            },
          },
        ],
      },
    }
    const input = JSON.stringify(record)

    const wrapper = mount(RecordValidation)

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(input)

    expect(wrapper.find('#validation-message').text()).toEqual('😀 Record is valid.')
    expect(wrapper.find('#validation-errors').exists()).not.toBeTruthy()
  })

  it('renders correctly with invalid user input ', async () => {
    const input = '[]'
    const expectedErrors = [
      {
        instancePath: '',
        schemaPath: '#/type',
        keyword: 'type',
        params: {
          type: 'object',
        },
        message: 'must be object',
      },
    ]

    const wrapper = mount(RecordValidation)

    const inputElement = wrapper.find('textarea')
    await inputElement.setValue(input)

    const errors = JSON.parse(wrapper.find('#validation-errors').text())
    expect(wrapper.find('#validation-message').text()).toEqual('😩 Record is invalid.')
    expect(errors).toEqual(expectedErrors)
  })

  it('renders correctly with a valid current record', async () => {
    const wrapper = mount(RecordValidation, { props: { currentRecord: supportedRecord } })

    // click validation-use-current button
    await wrapper.find('#validation-use-current').trigger('click')

    expect(wrapper.find('#validation-message').text()).toEqual('😀 Record is valid.')
    expect(wrapper.find('#validation-errors').exists()).not.toBeTruthy()

    // user input should be hidden when current record is validated
    expect(wrapper.find('#validation-input').exists()).not.toBeTruthy()
  })

  it('renders correctly with an invalid current record', async () => {
    const expectedErrors = [
      {
        instancePath: '/hierarchy_level',
        schemaPath: '#/definitions/hierarchy_level/enum',
        keyword: 'enum',
        params: {
          allowedValues: [
            'aggregate',
            'application',
            'attribute',
            'attributeType',
            'collection',
            'collectionHardware',
            'collectionSession',
            'dataset',
            'dimensionGroup',
            'document',
            'feature',
            'featureType',
            'fieldSession',
            'initiative',
            'metadata',
            'model',
            'nonGeographicDataset',
            'product',
            'propertyType',
            'repository',
            'sample',
            'series',
            'service',
            'software',
            'tile',
          ],
        },
        message: 'must be equal to one of the allowed values',
      },
    ]

    const wrapper = mount(RecordValidation, { props: { currentRecord: emptyIsoRecord } })

    // click validation-use-current button
    await wrapper.find('#validation-use-current').trigger('click')

    const errors = JSON.parse(wrapper.find('#validation-errors').text())
    expect(wrapper.find('#validation-message').text()).toEqual('😩 Record is invalid.')
    expect(errors).toEqual(expectedErrors)

    // user input should be hidden when current record is validated
    expect(wrapper.find('#validation-input').exists()).not.toBeTruthy()
  })
})
