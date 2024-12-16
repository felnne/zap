export enum AppEnvironmentLabel {
  LocalDevelopment = 'Local Development',
  ReviewApp = 'Review App',
  Integration = 'Integration',
  Production = 'Production',
}

export enum ResourceType {
  Collection = 'collection',
  Dataset = 'dataset',
  Product = 'product',
}

export enum ResourceStatus {
  draft = 'underDevelopment',
  complete = 'completed',
}

export enum ResourceUpdateFrequency {
  asNeeded = 'asNeeded',
}

export enum SectionType {
  Element = 'element',
  Info = 'info',
  Tools = 'tools',
}

export enum Stability {
  Stable = 'stable',
  Experimental = 'experimental',
}

export enum UploadSource {
  File = 'file',
  San = 'san',
}

export enum UploadStatus {
  Empty = 'empty', // input is blank, initial state
  Pending = 'pending', // input is present, but not yet uploading
  Uploading = 'uploading', // input is present and transferring to server
  Uploaded = 'uploaded', // input is present and has been uploaded
  Error = 'error', // input is present, but an error occurred
}

export enum ValidationStatus {
  Empty = 'empty', // input is blank, initial state
  Pending = 'pending', // input is present, but not yet validated
  Validating = 'validating', // input is present and being validated
  Error = 'error', // input is present, but is not allowed
  Invalid = 'invalid', // input is present, but cannot be understood be parsed
  Valid = 'valid', // input is present, can be understood and is allowed
}
