import type { Format, Organisation, Service } from '@/types/app'
import type { DistributionOption, PointOfContact as Contact, OnlineResource } from '@/types/iso'

import { getFormat, getFormatByExtension, getFormatByType } from '@/utils/data'

export const createDistributor = (org: Organisation): Contact => {
  return {
    organisation: {
      name: org.name,
      href: org.ror,
      title: 'ror',
    },
    phone: org.phone,
    address: org.address,
    email: org.email!,
    online_resource: org.online_resource,
    role: ['distributor'],
  }
}

export const getFileFormat = (file: File): Format => {
  // 'latin_music_continues.foo.bar.baz' => '.foo.bar.baz'
  const fileExt = `.${file.name.split('.').slice(1).join('.')}`

  let format = getFormatByType(file.type)
  if (format) return format
  format = getFormatByExtension(fileExt)
  if (format) return format

  // raise an exception
  throw new Error(`Cannot determine format.`)
}

export const createDistributionOption = (
  format: Format,
  onlineResource: OnlineResource,
  org: Organisation,
  sizeBytes: number = 0
): DistributionOption => {
  const distributionOption: DistributionOption = {
    format: {
      format: format.name,
      href: format.url,
    },
    transfer_option: {
      online_resource: onlineResource,
    },
    distributor: createDistributor(org),
  }

  if (format.version) {
    distributionOption.format!['version'] = format.version
  }

  if (sizeBytes) {
    distributionOption.transfer_option['size'] = {
      magnitude: sizeBytes,
      unit: 'bytes',
    }
  }

  return distributionOption
}

export const createDownloadDistributionOption = (
  file: File,
  endpoint: string,
  org: Organisation
): DistributionOption => {
  const fileFormat = getFileFormat(file)

  const onlineResource: OnlineResource = {
    href: endpoint,
    title: fileFormat.name,
    description: `Download information as ${fileFormat.description}`,
    function: 'download',
  }

  return createDistributionOption(fileFormat, onlineResource, org, file.size)
}

export const createServiceDistributionOption = (
  service: Service,
  endpoint: string,
  org: Organisation
): DistributionOption => {
  const serviceFormat: Format = getFormat(service.slug)

  const onlineResource: OnlineResource = {
    href: endpoint,
    title: service.name,
    description: service.description,
    function: 'download',
  }

  return createDistributionOption(serviceFormat, onlineResource, org)
}
