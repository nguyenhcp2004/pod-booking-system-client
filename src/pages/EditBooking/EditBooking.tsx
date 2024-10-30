import { Box, Fade } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { tokens } from '~/themes/theme'
import { useEffect, useState } from 'react'
import OrderBooking from '~/pages/EditBooking/OrderBooking'
import FAQList from '~/pages/EditBooking/FAQList'
import CustomerInfo from '~/pages/EditBooking/CustomerInfo'
import Contact from '~/pages/EditBooking/Contact'
import { useParams } from 'react-router-dom'
import { useGetOrderInfo } from '~/queries/useOrder'

export default function EditBooking() {
  const colors = tokens('light')
  const [loaded, setLoaded] = useState(false)
  const params = useParams()
  const { data } = useGetOrderInfo(params.orderId ?? '')
  const orderInfo = data?.data.data

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setLoaded(true)
  }, [])
  return (
    <>
      {orderInfo && (
        <Fade in={loaded} timeout={800}>
          <Box sx={{ height: '100%', padding: '24px 104px', backgroundColor: colors.grey[50] }}>
            <Box>
              <Grid container>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{ paddingRight: '12px', mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <OrderBooking orderDetail={orderInfo} />
                  <FAQList />
                </Grid>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{ paddingRight: '12px', mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <CustomerInfo />
                  <Contact orderDetail={orderInfo} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  )
}
