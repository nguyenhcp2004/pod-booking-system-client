import http from '~/utils/http'
import { PaymentReqDTO } from '~/schemaValidations/paymentSchema' // Giữ nguyên import này

interface PaymentUrlResType {
  amount: number
  orderId: string
}

export const generatePaymentUrl = async (paymentRequest: PaymentUrlResType) => {
  const parsedRequest = PaymentReqDTO.parse(paymentRequest)
  const response = await http.get('/payment/url', { params: parsedRequest })
  return response.data
}
