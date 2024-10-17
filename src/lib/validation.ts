import Ajv, { type DefinedError } from 'ajv'
import addFormats from 'ajv-formats'

import validationSchema from '@/schemas/record.json'

const _getValidator = (schema: object) => {
  const ajv = new Ajv({ strictTypes: false })
  addFormats(ajv)

  return ajv.compile(schema)
}

const _validateRecord = (data: object): DefinedError[] => {
  /*
   * Validate record data encoded as an object against JSON Schema
   *
   * A modified version of the BAS Metadata Library ISO 19139 (v3) schema is used for validation.
   *
   * Return an array of any validation errors list. If data validates, an empty list is returned.
   */
  const validator = _getValidator(validationSchema)

  validator(data)

  if (validator.errors === null) {
    return []
  }
  return validator.errors as DefinedError[]
}

export const validateRecordText = (record: string): DefinedError[] => {
  /*
   * Validate a complete record encoded as a JSON string against JSON Schema
   *
   * A modified version of the BAS Metadata Library ISO 19139 (v3) schema is used for validation.
   *
   * Steps:
   * 1. attempt to parse input from JSON encoded string, raising error and exiting if unable
   * 2. validate parsed data against schema and return any validation errors
   */
  let data = {}
  try {
    data = JSON.parse(record)
  } catch {
    throw new Error(`Cannot parse input as JSON.`)
  }

  return _validateRecord(data)
}
