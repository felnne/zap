import Ajv, { type DefinedError } from 'ajv'
import addFormats from 'ajv-formats'

import validationSchema from '@/data/validation.json'

const getValidator = (schema: any) => {
  const ajv = new Ajv()
  addFormats(ajv)
  ajv.addFormat('imprecise-date', {
    validate: (dateStr: string) => {
      // Regular expression to match year, year-month, year-month-day
      const regex = /^(?:\d{4}|(?:\d{4}-\d{2})|(?:\d{4}-\d{2}-\d{2}))$/
      return regex.test(dateStr)
    },
    type: 'string',
  })

  return ajv.compile(schema)
}

export const validateRecordText = (record: string): DefinedError[] => {
  /*
   * Validate a complete record encoded as a JSON string.
   *
   * Steps:
   * 1. attempt to parse input from JSON encoded string, raising error and exiting if unable
   * 2. setup validator using schema from JSON file
   * 3. validate parsed data against schema
   * 4. return validation errors list, if data validates return an empty list
   */
  let data = {}
  try {
    data = JSON.parse(record)
  } catch {
    throw new Error(`Cannot parse input as JSON.`)
  }

  const validator = getValidator(validationSchema)
  validator(data)

  if (validator.errors === null) {
    return []
  }
  return validator.errors as DefinedError[]
}
