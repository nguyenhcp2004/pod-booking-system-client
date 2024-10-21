import { AmenityPage } from './AmenityPage'
import { BookingAmenityInfo } from './BookingAmenityInfo'
import { Confirmed } from './Confirmed'
import { PaymentAmenityDetail } from './PaymentAmenityDetail'

export const listSteps = [
  {
    index: 1,
    describe: 'Tiện ích',
    element: AmenityPage
  },
  {
    index: 2,
    describe: 'Chi tiết',
    element: BookingAmenityInfo
  },
  {
    index: 3,
    describe: 'Thanh toán',
    element: PaymentAmenityDetail
  },
  {
    index: 4,
    describe: 'Kết thúc',
    element: Confirmed
  }
]
