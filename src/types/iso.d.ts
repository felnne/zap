export type Address = {
  delivery_point: string
  city: string
  administrative_area: string
  postal_code: string
  country: string
}

export type Constraint = {
  type: string
  restriction_code: string
  statement?: string
  href?: string
}

export type Dates = {
  [key: string]: string
}

export type Distribution = DistributionOption[]

export type DistributionOption = {
  format?: Format
  transfer_option: TransferOption
  distributor: PointOfContact
}

export type Extent = {
  identifier: string
  geographic: GeographicExtent
}

export type Format = {
  format: string
  href: string
  version?: string
}

export type GeographicExtent = {
  bounding_box: {
    west_longitude: number
    east_longitude: number
    south_latitude: number
    north_latitude: number
  }
}

export type Identification = {
  title: Title
  abstract: string
  dates: Dates
  edition?: string
  other_citation_details?: string
  identifiers?: Identifier[]
  contacts?: PointOfContact[]
  keywords?: KeywordSet[]
  constraints?: Constraint[]
  language: string
  character_set: string
  topics: string[]
  extents: Extent[]
  lineage?: Lineage
}

export type Identifier = {
  identifier: string
  href: string
  namespace: string
}

export type Individual = {
  name: string
  href: string
  title: string
}

export type KeywordSet = {
  terms: KeywordTerm[]
  type: string
  thesaurus: KeywordThesaurus
}

export type KeywordTerm = {
  term: string
  href?: string
}

export type KeywordThesaurus = {
  title: {
    value: string
    href?: string
  }
  dates?: Record<string, string>
  edition: string
  contact?: PointOfContact
}

export type Lineage = {
  statement: string
}

export type Metadata = {
  language: string
  character_set: string
  contacts: PointOfContact[]
  date_stamp: string
}

export type OnlineResource = {
  href: string
  title: string
  description: string
  function: string
}

export type Organisation = {
  name: string
  href: string
  title: string
}

export type PointOfContact = {
  individual?: Individual
  organisation: Organisation
  email?: string
  phone?: string
  address?: Address
  online_resource?: OnlineResource
  role: string[]
}

export type Record = {
  $schema: string
  file_identifier?: string
  hierarchy_level: string
  metadata: Metadata
  reference_system_info?: ReferenceSystemInfo
  identification: Identification
  distribution?: Distribution
}

export type ReferenceSystemInfo = {
  authority: {}
  code: {}
  version: string
}

export type Size = {
  unit: string
  magnitude: number
}

export type Title = {
  value: string
}

export type TransferOption = {
  size?: Size
  online_resource: OnlineResource
}
