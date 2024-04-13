import type { Record as IsoRecord } from '@/types/iso'
import { deepMergeObjects } from '@/lib/data'

const minimalRecord: IsoRecord = {
  $schema:
    'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
  hierarchy_level: 'dataset',
  metadata: {
    language: 'eng',
    character_set: 'utf8',
    contacts: [
      {
        organisation: {
          name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
          href: 'https://ror.org/01rhff309',
          title: 'ror',
        },
        role: ['pointOfContact'],
      },
    ],
    date_stamp: '2018-10-18',
  },
  identification: {
    title: { value: 'Test Record' },
    dates: { publication: '2018' },
    abstract:
      'Test Record for ISO 19115 metadata standard (no profile) with required properties only.',
    character_set: 'utf8',
    language: 'eng',
    topics: ['environment'],
    extents: [
      {
        identifier: 'bounding',
        geographic: {
          bounding_box: {
            west_longitude: -45.61521,
            east_longitude: -27.04976,
            south_latitude: -68.1511,
            north_latitude: -54.30761,
          },
        },
      },
    ],
  },
}

// Note: this object is not yet suitable for validation, it needs a proper implementation in a follow-on topic.
const supportedRecord: IsoRecord = deepMergeObjects(
  {
    file_identifier: '25585848-7b80-42f7-8d4a-069d7479c287',
    identification: {
      edition: '1.0',
      identifiers: [
        {
          identifier: '25585848-7b80-42f7-8d4a-069d7479c287',
          href: 'https://data.bas.ac.uk/items/25585848-7b80-42f7-8d4a-069d7479c287',
          namespace: 'data.bas.ac.uk',
        },
        {
          identifier: '1234567890',
          href: 'https://bas.maps.arcgis.com/home/item.html?id=1234567890',
          namespace: 'bas.maps.arcgis.com',
        },
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
      constraints: [
        {
          type: 'access',
          restriction_code: 'unrestricted',
          statement: 'Open Access (Anonymous)',
          href: '#%5B%5D',
        },
        {
          type: 'usage',
          restriction_code: 'license',
          statement:
            'This information is licensed under the Open Government Licence v3.0. To view this licence, visit http://www.nationalarchives.gov.uk/doc/open-government-licence/.',
          href: 'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
        },
      ],
      other_citation_details:
        'Required citation:\n> Gerrish, L. (2024). _x_ (Version 1.0) [Data set]. NERC EDS UK Polar Data Centre. https://doi.org/10.5285/25585848-7b80-42f7-8d4a-069d7479c287',
      keywords: [
        {
          terms: [
            {
              term: 'Utility and governmental services',
              href: 'https://www.eionet.europa.eu/gemet/en/inspire-theme/us',
            },
          ],
          type: 'theme',
          thesaurus: {
            title: {
              value: 'General Multilingual Environmental Thesaurus - INSPIRE themes',
              href: 'http://www.eionet.europa.eu/gemet/inspire_themes',
            },
            dates: { publication: '2018-08-16' },
            edition: '4.1.2',
            contact: {
              organisation: {
                name: 'European Environment Information and Observation Network (EIONET), European Environment Agency (EEA)',
                href: 'https://ror.org/02k4b9v70',
                title: 'ror',
              },
              email: 'helpdesk@eionet.europa.eu',
              online_resource: {
                href: 'https://www.eionet.europa.eu/gemet/en/themes/',
                title:
                  'GEMET INSPIRE Spatial Data Themes  General Multilingual Environmental Thesaurus',
                description:
                  'GEMET, the GEneral Multilingual Environmental Thesaurus, has been developed as a multilingual thesauri for indexing, retrieval and control of terms in order to save time, energy and funds.',
                function: 'information',
              },
              role: ['publisher'],
            },
          },
        },
        {
          terms: [
            {
              term: 'Living and working in Antarctica',
              href: 'http://vocab.nerc.ac.uk/collection/T01/current/0d6365f7-7f89-41fa-bb14-b42023d1f08b/1/',
            },
          ],
          type: 'theme',
          thesaurus: {
            title: {
              value: 'British Antarctic Survey research topics',
              href: 'http://vocab.nerc.ac.uk/collection/T01/current/',
            },
            dates: { publication: '2020-05-06' },
            edition: '1',
            contact: {
              organisation: {
                name: 'UK Polar Data Centre, Natural Environment Research Council',
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
              email: 'polardatacentre@bas.ac.uk',
              online_resource: {
                href: 'https://www.bas.ac.uk/team/business-teams/information-services/uk-polar-data-centre/',
                title: 'UK Polar Data Centre (UK PDC) - BAS public website',
                description:
                  'General information about the UK Polar Data Centre (UK PDC) from the British Antarctic Survey (BAS) public website.',
                function: 'information',
              },
              role: ['publisher'],
            },
          },
        },
      ],
      lineage: 'xxx',
    },
    distribution: [
      {
        format: {
          format: 'JPEG',
          href: 'https://jpeg.org/jpeg/',
        },
        transfer_option: {
          online_resource: {
            href: 'http://basweb.nerc-bas.ac.uk/~felnne/apps/zap-uploads/25585848-7b80-42f7-8d4a-069d7479c287/07de50d1282a72c512ed75737ee053b1.jpg',
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
          format: 'OGC Web Map Service (WMS)',
          href: 'https://www.ogc.org/standards/wms',
          version: '1.3.0',
        },
        transfer_option: {
          online_resource: {
            href: 'https://example.com',
            title: 'OGC Web Map Service (WMS)',
            description: 'Access information as a OGC Web Map Service layer.',
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
)

export const minimalRecordAsText = (): string => JSON.stringify(minimalRecord)
export const supportedRecordAsText = (): string => JSON.stringify(supportedRecord)
