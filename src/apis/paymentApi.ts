import http from '~/utils/http'
import { PaymentReqDTO } from '~/schemaValidations/paymentSchema'

interface PaymentUrlResType {
  amount: number
  orderId: string
  returnUrl: string
}

export const generatePaymentUrl = async (paymentRequest: PaymentUrlResType) => {
  const parsedRequest = PaymentReqDTO.parse(paymentRequest)
  const response = await http.get('/payment/url', { params: parsedRequest })
  return response.data
}

export const fetchTransactionInfo = async (
  vnp_Amount: string,
  vnp_BankCode: string,
  vnp_OrderInfo: string,
  vnp_ResponseCode: string
) => {
  const parsedRequest = {
    vnp_Amount: vnp_Amount,
    vnp_BankCode: vnp_BankCode,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_ResponseCode: vnp_ResponseCode
  }
  const response = await http.get(`/payment/info`, { params: parsedRequest })
  return response.data
}
