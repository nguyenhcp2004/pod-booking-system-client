import { Autocomplete, Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import pod from '~/assets/images/pod.jpg'
import moment from 'moment'
import homePageBanner from '~/assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers'
import { formatCurrency } from '~/utils/currency'
import ImageView from '~/components/ImageView/ImageView'
import MonthView from '~/components/Calendar/Calendar'

import { useQuery } from '@tanstack/react-query'
import servicePackageApiRequest from '~/apis/servicePackage'
import { useEffect } from 'react'

const podDataMock = {
  id: '103',
  name: 'Phòng POD đôi',
  description:
    'Pod 103 is a 4-person pod with a 55-inch screen, a whiteboard, and a video camera. It is perfect for team meetings.',
  price: 100000,
  images: [
    pod,
    homePageBanner,
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/id/238/200/300',
    'https://picsum.photos/id/239/200/300'
  ]
}
export default function RoomDetail() {
  const { data } = useQuery({
    queryKey: ['service-package'],
    queryFn: servicePackageApiRequest.getAll
  })

  return (
    <Box
      sx={{ padding: { xs: '24px 104px', md: '24px 256px' }, display: 'flex', flexDirection: 'column', gap: '28px' }}
    >
      <Grid container size={12} spacing={6}>
        <Grid container size={{ xs: 12, md: 6 }} rowSpacing={1}>
          <Box sx={{ width: '100%' }}>
            <ImageView images={podDataMock.images} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ gap: '40px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
                {podDataMock.name}
              </Typography>
              <Typography variant='h5' color='primary'>
                {formatCurrency(podDataMock.price)}
                <Typography variant='h5' color='neutral' display={'inline'}>
                  /tiếng
                </Typography>
              </Typography>
            </Box>

            <Box>
              <Grid container size={12} spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DatePicker label='Ngày đặt' slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField select label='Slot' fullWidth size='small'>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <Autocomplete
                    multiple
                    options={[]}
                    renderInput={(params) => <TextField {...params} label='Chọn phòng' size='small' />}
                  />
                </Grid>
                <Grid size={12}>
                  <Autocomplete
                    options={['Gói tháng 1', 'Gói tháng 2']}
                    renderInput={(params) => <TextField {...params} label='Chọn gói' size='small' />}
                  />
                </Grid>
                <Grid size={12}>
                  <Button variant='contained' color='primary' fullWidth>
                    Đặt phòng
                  </Button>
                </Grid>
                <Grid size={12}>
                  <MonthView
                    selected={[
                      moment(),
                      moment().add(1, 'day'),
                      moment().add(2, 'day'),
                      moment().add(3, 'day'),
                      moment().add(4, 'day')
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ padding: '24px 40px', borderRadius: '16px', border: '1px solid ', minHeight: '200px' }}>
        <Typography variant='h4' color='primary' fontWeight={'bold'}>
          Chi tiết
        </Typography>
        <Typography variant='subtitle2'>{podDataMock.description}</Typography>
      </Box>
    </Box>
  )
}
