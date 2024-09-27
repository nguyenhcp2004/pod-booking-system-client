import { Amenities } from './Amenities'
import { BookingInfo } from './BookingInfo'
import { Confirmed } from './Confirmed'
import { PaymentDetail } from './PaymentDetail'

export const listSteps = [
  {
    index: 1,
    describe: 'Tiện ích',
    element: Amenities
  },
  {
    index: 2,
    describe: 'Chi tiết',
    element: BookingInfo
  },
  {
    index: 3,
    describe: 'Thanh toán',
    element: PaymentDetail
  },
  {
    index: 4,
    describe: 'Kết thúc',
    element: Confirmed
  }
]
