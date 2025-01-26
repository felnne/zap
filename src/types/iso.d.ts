export type Address = {
  delivery_point: string
  city: string
  administrative_area: string
  postal_code: string
  country: string
}

export type Aggregation = {
  association_type: string
  initiative_type?: string
  identifier: Identifier
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

export type DomainConsistency = {
  specification: object
  explanation: string
  result: boolean
}

export type Extent = {
  identifier: string
  geographic: GeographicExtent
  temporal?: TemporalExtent
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

export type GraphicOverview = {
  identifier: string
  href: string
  description?: string
  mime_type: string
}

export type Identification = {
  title: Title
  abstract: string
  purpose?: string
  dates: Dates
  edition: string
  series?: Series
  other_citation_details?: string
  identifiers: Identifier[]
  contacts: PointOfContact[]
  maintenance: Maintenance
  graphic_overviews?: GraphicOverview[]
  keywords?: KeywordSet[]
  constraints: Constraint[]
  aggregations?: Aggregation[]
  language: string
  character_set?: string
  topics?: string[]
  spatial_resolution?: number
  extents: Extent[]
  supplemental_information?: string
  lineage?: Lineage
  domain_consistency: DomainConsistency[]
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

export type Maintenance = {
  maintenance_frequency: string
  progress: string
}

export type Metadata = {
  metadata_standard?: MetadataStandard
  language?: string
  character_set?: string
  contacts: PointOfContact[]
  date_stamp: string
}

export type MetadataStandard = {
  name?: string
  version?: string
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
  file_identifier: string
  hierarchy_level: string
  metadata: Metadata
  reference_system_info?: ReferenceSystemInfo
  identification: Identification
  distribution?: Distribution
}

export type ReferenceSystemInfo = {
  authority: object
  code: object
  version: string
}

export type Series = {
  name: string
  edition?: string
  sheet?: string
}

export type Size = {
  unit: string
  magnitude: number
}

export type TemporalExtent = {
  period: {
    start: string
    end?: string
  }
}

export type Title = {
  value: string
}

export type TransferOption = {
  size?: Size
  online_resource: OnlineResource
}
