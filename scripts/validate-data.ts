const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')

const _validate = (data: object, schema: object): object[] => {
  const ajv = new Ajv()
  const validator = ajv.compile(schema)
  const valid = validator(data)

  if (!valid) {
    return validator.errors
  }
  return []
}

const _get_items = (data: object): { [key: string]: { slug: string, [key: string]: any } } => {
  const parentKey = Object.keys(data)[1] // 0 is the $schema ref
  const items = data[parentKey]
  return items
}

const _ensureSlugIntegrity = (data: object): string[] => {
  const items = _get_items(data)

  // Items is an object whose keys are slugs, each value is an object which also has a slug key
  // - the value of the slug key must match the object key for each item.
  const nonMatchingSlugs = Object.entries(items).filter(([key, value]: [string, { slug: string }]) => key !== value.slug)

  // return non-matching slugs as an array of strings in the form of "key: value.slug"
  return nonMatchingSlugs.map(([key, value]: [string, { slug: string }]) => `${key}: ${value.slug}`)
}

const _ensureUniqueSlugs = (data: object): string[] => {
  const items = _get_items(data)

  // Items is an object whose keys are slugs, each value is an object which also has a slug key
  // - slugs must be unique across all items, which can be checked using the slug key of each item.
  // The object keys aren't used as they may be clobbered if two items have the same slug
  // - i.e. they will appear unique but all but one will actually be missing.
  const slugs = Object.values(items).map((item) => item.slug)
  const nonUniqueSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index || slugs.indexOf(slug, index + 1) !== -1)
  return nonUniqueSlugs
}

const _validateDataFile = (name): void => {
  const data = require(path.join(__dirname, `../src/data/${name}.json`))
  const schema = require(path.join(__dirname, `../src/schemas/${name}.json`))

  // fail if data doesn't validate against schema
  const errors = _validate(data, schema)
  if (errors.length > 0) {
    console.error(`Data in ${name}.json does not validate against ${name}.schema.json 😱`)
    console.error(errors)
    console.info('')
  }

  // fail if data doesn't have slug integrity
  const nonMatchingSlugs = _ensureSlugIntegrity(data)
  if (nonMatchingSlugs.length > 0) {
    console.error(`Data in ${name}.json has non-matching slugs 😱`)
    console.error(nonMatchingSlugs)
    console.info('')
  }

  // fail if data doesn't have unique slugs
  const nonUniqueSlugs = _ensureUniqueSlugs(data)
  if (nonUniqueSlugs.length > 0) {
    console.error(`Data in ${name}.json has non-unique slugs 😱`)
    console.error(nonUniqueSlugs)
    console.info('')
  }
}

const _validateAppFile = (name: string): void => {
  const data = require(path.join(__dirname, `../src/data/${name}.json`))
  const schema = require(path.join(__dirname, `../src/schemas/${name}.json`))

  // fail if data doesn't validate against schema
  const errors = _validate(data, schema)
  if (errors.length > 0) {
    console.error(`Data in ${name}.json does not validate against ${name}.schema.json 😱`)
    console.error(errors)
    console.info('')
  }
}

const _getDataFileNames = (excludeNames: string[]): string[] => {
  const dataDir = path.join(__dirname, '../src/schemas')

  const names = fs.readdirSync(dataDir).map((file) => file.replace('.json', ''))
  return names.filter((name) => !excludeNames.includes(name))
}

const validateDataFiles = (): void => {
  const appFileNames = ['ideas', 'settings']
  console.log(`App files: [${appFileNames.join(', ')}]`)
  const excludeNames = [...appFileNames, 'record-src', 'record']
  const dataFileNames = _getDataFileNames(excludeNames)
  console.log(`Discovered schemas: [${dataFileNames.join(', ')}]`)
  console.log('')
  dataFileNames.forEach((name) => _validateDataFile(name))
  appFileNames.forEach((name) => _validateAppFile(name))
}

validateDataFiles()
