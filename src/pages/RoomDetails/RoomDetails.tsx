import { Autocomplete, Box, Button, Checkbox, FormControl, MenuItem, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import pod from '~/assets/images/pod.jpg'
import moment, { Moment } from 'moment'
import homePageBanner from '~/assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers'
import { formatCurrency } from '~/utils/currency'
import ImageView from '~/components/ImageView/ImageView'
import MonthView from '~/components/Calendar/Calendar'

import { useQuery } from '@tanstack/react-query'
import servicePackageApiRequest from '~/apis/servicePackage'
import { SLOT } from '~/constants/slot'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { useState } from 'react'
import { ServicePackage } from '~/constants/type'
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
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment())
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)
  const { data, isSuccess } = useQuery({
    queryKey: ['service-package'],
    queryFn: servicePackageApiRequest.getAll
  })

  return (
    <Box
      sx={{
        padding: { xs: '24px 24px', sm: '24px 104px', lg: '24px 256px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}
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
                <Typography color='neutral' display={'inline'}>
                  /tiếng
                </Typography>
              </Typography>
            </Box>

            <Box>
              <Grid container size={12} spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DatePicker
                    label='Ngày đặt'
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    format={DEFAULT_DATE_FORMAT}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      multiple
                      options={SLOT}
                      disableCloseOnSelect
                      limitTags={2}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                              checkedIcon={<CheckBoxIcon fontSize='small' />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                              size='small'
                            />
                            {option}
                          </li>
                        )
                      }}
                      renderInput={(params) => <TextField {...params} label='Slot' size='small' />}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      multiple
                      options={[]}
                      limitTags={2}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                              checkedIcon={<CheckBoxIcon fontSize='small' />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                              size='small'
                            />
                            {option}
                          </li>
                        )
                      }}
                      renderInput={(params) => <TextField {...params} label='Chọn phòng' size='small' />}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      value={selectedPackage}
                      onChange={(_, servicePackage) => {
                        setSelectedPackage(servicePackage)
                      }}
                      options={isSuccess ? data.data.data : []}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label='Chọn gói' size='small' />}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <Button variant='contained' color='primary' fullWidth>
                    Đặt phòng
                  </Button>
                </Grid>
                <Grid size={12}>
                  <MonthView selected={selectedDate ? [selectedDate] : []} />
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
