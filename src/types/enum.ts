export enum AggregationAssociation {
  largerWorkCitation = 'largerWorkCitation',
}

export enum AggregationInitiative {
  collection = 'collection',
}

export enum AppEnvironmentLabel {
  LocalDevelopment = 'Local Development',
  ReviewApp = 'Review App',
  Integration = 'Integration',
  Production = 'Production',
}

export enum CitationTemplate {
  datasetPdc = 'Dataset (PDC)',
  datasetMagic = 'Dataset (MAGIC)',
  productMapMagicGeneral = 'Product (Map, MAGIC, General)',
  productMapMagicPublished = 'Product (Map, MAGIC, Published)',
  unknown = 'Unknown',
}

export enum ResourceType {
  Collection = 'collection',
  Dataset = 'dataset',
  Product = 'product',
}

export enum ResourceTypeAlias {
  Collection = 'collections',
  Dataset = 'datasets',
  Product = 'maps',
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

export enum UploadAccess {
  Internal = 'internal',
  External = 'external',
}

export enum UploadContext {
  Download = 'download',
  Thumbnail = 'thumbnail',
}

export enum UploadSource {
  File = 'file',
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
