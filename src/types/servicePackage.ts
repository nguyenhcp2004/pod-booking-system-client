import { z } from 'zod'

export type ServicePackage = {
  id: string
  name: string
  discountPercentage: number
}

export const ServicePackageRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      discountPercentage: z.number()
    })
  ),
  message: z.string(),
  code: z.number()
})

export type ServicePackageResType = z.TypeOf<typeof ServicePackageRes>
