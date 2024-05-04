export enum Stability {
  Stable = 'stable',
  Experimental = 'experimental',
}

export enum ResourceType {
  Collection = 'collection',
  Dataset = 'dataset',
  Product = 'product',
}

export enum ValidationStatus {
  Empty = 'empty', // input is blank, initial state
  Error = 'error', // input is present, but is not allowed
  Invalid = 'invalid', // input is present, but cannot be understood be parsed
  Valid = 'valid', // input is present, can be understood and is allowed
}

export enum UploadStatus {
  Empty = 'empty', // input is blank, initial state
  Pending = 'pending', // input is present, but not yet uploading
  Uploading = 'uploading', // input is present and transferring to server
  Uploaded = 'uploaded', // input is present and has been uploaded
  Error = 'error', // input is present, but an error occurred
}
