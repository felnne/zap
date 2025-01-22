import type { Record as IsoRecord } from '../../types/iso'

// Relative imports and duplicated code used to work around buggy Playwright `@/lib` path resolving.
// Therefore additional methods such as createAuthor are not used, leading to statically defined data.

// duplicated from @/lib/data.ts
type StrKeyObj = { [key: string]: unknown }

// duplicated from @/lib/data.ts
const _isObject = (item: unknown): item is StrKeyObj => {
  /* Check if an item is an object */
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

// duplicated from @/lib/data.ts
export const deepMergeObjects = (source: StrKeyObj, target: StrKeyObj): StrKeyObj => {
  /* Merge the first object into a clone of the second recursively, returning the new object. */
  const output = JSON.parse(JSON.stringify(source))

  if (_isObject(target) && _isObject(source)) {
    Object.keys(target).forEach((key) => {
      if (_isObject(target[key]) || _isObject(source[key])) {
        if (!(key in source) || !_isObject(source[key])) {
          Object.assign(output, { [key]: target[key] })
        } else {
          output[key] = deepMergeObjects(source[key] as StrKeyObj, target[key] as StrKeyObj)
        }
      } else {
        Object.assign(output, { [key]: target[key] })
      }
    })
  }
  return output
}

// taken from Metadata Library minimal_product_v1 record config
export const minimalRecord: IsoRecord = {
  $schema:
    'https://metadata-resources.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v4.json',
  file_identifier: 'f866c298-3b9a-4624-ac31-cd6b97c146fa',
  metadata: {
    contacts: [
      {
        organisation: {
          name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
          href: 'https://ror.org/01rhff309',
          title: 'ror',
        },
        phone: '+44 (0)1223 221400',
        address: {
          delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
          city: 'Cambridge',
          administrative_area: 'Cambridgeshire',
          postal_code: 'CB3 0ET',
          country: 'United Kingdom',
        },
        email: 'magic@bas.ac.uk',
        online_resource: {
          href: 'https://www.bas.ac.uk/teams/magic',
          title: 'Mapping and Geographic Information Centre (MAGIC) - BAS public website',
          description:
            'General information about the BAS Mapping and Geographic Information Centre (MAGIC) from the British Antarctic Survey (BAS) public website.',
          function: 'information',
        },
        role: ['pointOfContact'],
      },
    ],
    date_stamp: '2024-10-03',
  },
  hierarchy_level: 'product',
  identification: {
    title: {
      value: 'Test product with minimal MAGIC Discovery Profile properties',
    },
    dates: {
      creation: '2024-09-14',
    },
    edition: '1',
    identifiers: [
      {
        identifier: 'f866c298-3b9a-4624-ac31-cd6b97c146fa',
        href: 'https://data.bas.ac.uk/items/f866c298-3b9a-4624-ac31-cd6b97c146fa',
        namespace: 'data.bas.ac.uk',
      },
    ],
    abstract:
      'An example product to verify a record with the minimal set of properties required by the MAGIC Discovery Profile is handled correctly.',
    contacts: [
      {
        organisation: {
          name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
          href: 'https://ror.org/01rhff309',
          title: 'ror',
        },
        phone: '+44 (0)1223 221400',
        address: {
          delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
          city: 'Cambridge',
          administrative_area: 'Cambridgeshire',
          postal_code: 'CB3 0ET',
          country: 'United Kingdom',
        },
        email: 'magic@bas.ac.uk',
        online_resource: {
          href: 'https://www.bas.ac.uk/teams/magic',
          title: 'Mapping and Geographic Information Centre (MAGIC) - BAS public website',
          description:
            'General information about the BAS Mapping and Geographic Information Centre (MAGIC) from the British Antarctic Survey (BAS) public website.',
          function: 'information',
        },
        role: ['pointOfContact'],
      },
    ],
    maintenance: {
      maintenance_frequency: 'asNeeded',
      progress: 'completed',
    },
    constraints: [
      {
        type: 'access',
        restriction_code: 'unrestricted',
      },
      {
        type: 'usage',
        restriction_code: 'license',
        statement:
          'This information is licensed under the Open Government Licence (OGL 3.0). To view this licence, visit https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/.',
        href: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      },
    ],
    language: 'eng',
    extents: [
      {
        identifier: 'bounding',
        geographic: {
          bounding_box: {
            west_longitude: -180.0,
            east_longitude: 180.0,
            south_latitude: -90.0,
            north_latitude: -60.0,
          },
        },
      },
    ],
    lineage: {
      statement: 'This is a fictitious record and has no real origin.',
    },
    domain_consistency: [
      {
        specification: {
          title: {
            value:
              'British Antarctic Survey (BAS) Mapping and Geographic Information Centre (MAGIC) Discovery Metadata Profile',
            href: 'https://metadata-standards.data.bas.ac.uk/profiles/magic-discovery-v1/',
          },
          dates: {
            publication: '2024-11-01',
          },
          edition: '1',
          contact: {
            organisation: {
              name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
              href: 'https://ror.org/01rhff309',
              title: 'ror',
            },
            phone: '+44 (0)1223 221400',
            address: {
              delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
              city: 'Cambridge',
              administrative_area: 'Cambridgeshire',
              postal_code: 'CB3 0ET',
              country: 'United Kingdom',
            },
            email: 'magic@bas.ac.uk',
            online_resource: {
              href: 'https://www.bas.ac.uk/teams/magic',
              title: 'Mapping and Geographic Information Centre (MAGIC) - BAS public website',
              description:
                'General information about the BAS Mapping and Geographic Information Centre (MAGIC) from the British Antarctic Survey (BAS) public website.',
              function: 'information',
            },
            role: ['publisher'],
          },
        },
        explanation:
          'Resource within scope of British Antarctic Survey (BAS) Mapping and Geographic Information Centre (MAGIC) Discovery Metadata Profile.',
        result: true,
      },
    ],
  },
}

export const supportedRecord: IsoRecord = deepMergeObjects(
  {
    identification: {
      dates: {
        revision: '2024-10-14',
        released: '2024-09-14T11:16:22+00:00',
        publication: '2024-09-14T11:16:22+00:00',
      },
      purpose: 'Test Record',
      identifiers: [
        {
          identifier: 'https://gitlab.data.bas.ac.uk/foo/-/issues/1',
          href: 'https://gitlab.data.bas.ac.uk/foo/-/issues/1',
          namespace: 'https://gitlab.data.bas.ac.uk',
        },
        {
          identifier: '10.5285/25585848-7b80-42f7-8d4a-069d7479c287',
          href: 'https://doi.org/10.5285/25585848-7b80-42f7-8d4a-069d7479c287',
          namespace: 'doi',
        },
        {
          identifier: 'foo',
          href: 'https://data.bas.ac.uk/datasets/foo',
          namespace: 'alias.data.bas.ac.uk',
        },
      ],
      contacts: [
        {
          individual: {
            name: 'Gerrish, Laura',
            href: 'https://orcid.org/0000-0003-1410-9122',
            title: 'ocrid',
          },
          organisation: {
            name: 'British Antarctic Survey',
            href: 'https://ror.org/01rhff309',
            title: 'ror',
          },
          email: 'lauger@bas.ac.uk',
          phone: '+44 (0)1223 221400',
          address: {
            delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
            city: 'Cambridge',
            administrative_area: 'Cambridgeshire',
            postal_code: 'CB3 0ET',
            country: 'United Kingdom',
          },
          online_resource: {
            href: 'https://orcid.org/0000-0003-1410-9122',
            title: 'ORCID record',
            description:
              'ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.',
            function: 'information',
          },
          role: ['author'],
        },
      ],
      graphic_overviews: [
        {
          identifier: 'overview',
          description: 'General overview of resource',
          href: 'https://example.com/image.png',
          mime_type: 'image/png',
        },
      ],
      extents: [
        {
          identifier: 'partialTemporal',
          geographic: {
            bounding_box: {
              west_longitude: -180.0,
              east_longitude: 180.0,
              south_latitude: -90.0,
              north_latitude: -60.0,
            },
          },
          temporal: {
            period: {
              start: '2024-09-14',
            },
          },
        },
        {
          identifier: 'boundTemporal',
          geographic: {
            bounding_box: {
              west_longitude: -180.0,
              east_longitude: 180.0,
              south_latitude: -90.0,
              north_latitude: -60.0,
            },
          },
          temporal: {
            period: {
              start: '2024-09-14',
              end: '2024-09-14',
            },
          },
        },
      ],
      aggregations: [
        {
          association_type: 'largerWorkCitation',
          initiative_type: 'collection',
          identifier: {
            identifier: '1976fb02-816a-46db-8606-ff4193bbecdb',
            href: 'https://data.bas.ac.uk/items/1976fb02-816a-46db-8606-ff4193bbecdb',
            namespace: 'data.bas.ac.uk',
          },
        },
      ],
      other_citation_details:
        'Required citation:\n> Gerrish, L. (2024). _x_ (Version 1) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/25585848-7b80-42f7-8d4a-069d7479c287',
    },
    distribution: [
      {
        format: {
          format: 'JPEG',
          href: 'https://jpeg.org/jpeg/',
        },
        transfer_option: {
          online_resource: {
            href: 'https://basweb.nerc-bas.ac.uk/~felnne/apps/zap-uploads/25585848-7b80-42f7-8d4a-069d7479c287/07de50d1282a72c512ed75737ee053b1.jpg',
            title: 'JPEG',
            description: 'Download information as a JPEG image',
            function: 'download',
          },
          size: {
            magnitude: 90573,
            unit: 'bytes',
          },
        },
        distributor: {
          organisation: {
            name: 'NERC EDS UK Polar Data Centre',
            href: 'https://ror.org/02b5d8509',
            title: 'ror',
          },
          phone: '+44 (0)1223 221400',
          address: {
            delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
            city: 'Cambridge',
            administrative_area: 'Cambridgeshire',
            postal_code: 'CB3 0ET',
            country: 'United Kingdom',
          },
          email: 'pdcservicedesk@bas.ac.uk',
          online_resource: {
            href: 'https://www.bas.ac.uk/data/uk-pdc/',
            title: 'UK Polar Data Centre (UK PDC) - BAS public website',
            description:
              'General information about the UK Polar Data Centre (UK PDC) from the British Antarctic Survey (BAS) public website.',
            function: 'information',
          },
          role: ['distributor'],
        },
      },
      {
        format: {
          format: 'Fake Service Type',
          href: 'https://fake.service',
        },
        transfer_option: {
          online_resource: {
            href: 'https://example.com',
            title: 'Fake Service Type',
            description: 'Access information as a Placeholder service type.',
            function: 'download',
          },
        },
        distributor: {
          organisation: {
            name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
            href: 'https://ror.org/01rhff309',
            title: 'ror',
          },
          phone: '+44 (0)1223 221400',
          address: {
            delivery_point: 'British Antarctic Survey, High Cross, Madingley Road',
            city: 'Cambridge',
            administrative_area: 'Cambridgeshire',
            postal_code: 'CB3 0ET',
            country: 'United Kingdom',
          },
          email: 'magic@bas.ac.uk',
          online_resource: {
            href: 'https://www.bas.ac.uk/teams/magic',
            title: 'Mapping and Geographic Information Centre (MAGIC) - BAS public website',
            description:
              'General information about the BAS Mapping and Geographic Information Centre (MAGIC) from the British Antarctic Survey (BAS) public website.',
            function: 'information',
          },
          role: ['distributor'],
        },
      },
    ],
  },
  minimalRecord
) as IsoRecord

export const minimalRecordAsText = JSON.stringify(minimalRecord, null, 2)
export const supportedRecordAsText = JSON.stringify(supportedRecord, null, 2)
