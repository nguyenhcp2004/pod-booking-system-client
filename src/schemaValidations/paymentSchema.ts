// src/schemaValidations/payment.schema.ts
import { z } from 'zod'

export const PaymentReqDTO = z.object({
  amount: z.number().min(1000).nonnegative(),
  orderId: z.string().min(1),
  returnUrl: z.string().min(1)
})
