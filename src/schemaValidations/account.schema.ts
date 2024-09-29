import { z } from 'zod'
import { Account } from '~/schemaValidations/auth.schema'

export const GetMeBody = z
  .object({
    id: z.string()
  })
  .strict()

export type GetMeBodyType = z.TypeOf<typeof GetMeBody>

export const GetMeRes = z.object({
  data: Account,
  message: z.string(),
  code: z.number()
})

export type GetMeResType = z.TypeOf<typeof GetMeRes>
