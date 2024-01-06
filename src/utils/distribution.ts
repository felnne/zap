import type { Format, Organisation, Service } from '@/types/app'
import type { DistributionOption, PointOfContact as Contact, OnlineResource } from '@/types/iso'

import {getFormat} from '@/utils/data'

export const createDistributor = (org: Organisation): Contact => {
  return {
    organisation: {
      name: org.name,
      href: org.ror,
      title: 'ror'
    },
    phone: org.phone,
    address: org.address,
    email: org.email!,
    online_resource: org.online_resource,
    role: ['distributor']
  }
}

export const createServiceDistributionOption = (service: Service, endpoint: string, org: Organisation): DistributionOption => {
  const serviceFormat: Format = getFormat(service.slug)

  const onlineResource: OnlineResource = {
    href: endpoint,
    title: service.name,
    description: service.description,
    function: 'download'
  }

  return {
    format: {
      format: serviceFormat.name,
      href: serviceFormat.url,
      version: serviceFormat.version
    },
    transfer_option: {
      online_resource: onlineResource
    },
    distributor: createDistributor(org)
  }
}
