export enum Stability {
  Stable = 'stable',
  Experimental = 'experimental',
}

export enum ResourceType {
  Collection = 'collection',
  Dataset = 'dataset',
  Product = 'product',
}

export enum UploadStatus {
  Empty = 'empty', // input is blank, initial state
  Pending = 'pending', // input is present, but not yet uploading
  Uploading = 'uploading', // input is present and transferring to server
  Uploaded = 'uploaded', // input is present and has been uploaded
  Error = 'error', // input is present, but an error occurred
}
