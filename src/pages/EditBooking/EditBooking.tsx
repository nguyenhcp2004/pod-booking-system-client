import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Fade, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Typography, Divider, useTheme, Avatar } from '@mui/material'
import ModeCommentIcon from '@mui/icons-material/ModeComment'

import { tokens } from '~/themes/theme'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

export default function EditBooking() {
  const theme = useTheme()
  const colors = tokens('light')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])
  return (
    <Fade in={loaded} timeout={800}>
      <Box sx={{ height: '100%', padding: '24px 104px', backgroundColor: colors.grey[50] }}>
        <Box>
          <Grid container>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ paddingRight: '12px', mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}>
                <Box sx={{ padding: '20px' }}>
                  <Typography variant='h5' color={theme.palette.primary.main} gutterBottom fontWeight='bold'>
                    Đơn đặt
                  </Typography>
                  <Box display='flex' alignItems='center' sx={{ marginTop: '24px' }} gap='20px'>
                    <Avatar
                      alt='phong 2 nguoi'
                      sx={{ width: '200px', height: '193px', borderRadius: '16px' }}
                      variant='rounded'
                    />
                    <Box
                      sx={{
                        minHeight: '193px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant='h5' fontWeight='bold'>
                        phòng 2 người
                      </Typography>
                      <Box display='flex' sx={{ marginTop: '4px' }}>
                        <Typography variant='subtitle2' color={theme.palette.primary.main}>
                          1000 VND
                        </Typography>
                        <Typography variant='subtitle2'>/tiếng</Typography>
                      </Box>
                      <Box sx={{ marginTop: '12px' }} flexDirection='column' display='flex' gap='12px'>
                        <Box display='flex' gap='3px'>
                          <Typography variant='body2' fontWeight='bold'>
                            Địa chỉ:
                          </Typography>
                          <Typography variant='body2'>Thủ Đức</Typography>
                        </Box>
                        <Box display='flex' gap='3px'>
                          <Typography variant='body2' fontWeight='bold'>
                            Ngày:
                          </Typography>
                          <Typography variant='body2'>12/2024</Typography>
                        </Box>
                        <Box display='flex' gap='3px'>
                          <Typography variant='body2' fontWeight='bold'>
                            Slot:
                          </Typography>
                          <Typography variant='body2'>2:00 - 5:00</Typography>
                        </Box>
                        <Box display='flex' gap='3px'>
                          <Typography variant='body2' fontWeight='bold'>
                            Phòng:
                          </Typography>
                          <Typography variant='body2'>abc</Typography>
                        </Box>
                        <Box display='flex' gap='3px'>
                          <Typography variant='body2' fontWeight='bold'>
                            Gói dịch vụ:
                          </Typography>
                          <Typography variant='body2'>(2 ngày)</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ padding: '20px' }} display='flex' flexDirection='column' gap='20px'>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                      Tổng các phòng:
                    </Typography>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      100000 VND
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                      Tổng các dịch vụ:
                    </Typography>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      10000 VND
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                      Giảm giá: (gói ngày 5%)
                    </Typography>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      100000 VND
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ padding: '20px' }} display='flex' justifyContent='space-between'>
                  <Typography variant='subtitle2' color={theme.palette.grey[500]}>
                    Tổng đơn:
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    10000 VND
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', padding: '20px' }}>
                  <Button
                    fullWidth
                    sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
                  >
                    Hủy đặt phòng
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: 'white',
                  padding: '20px',
                  borderRadius: 2,
                  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700', marginBottom: '1rem' }}>
                  Câu hỏi thường gặp khi hủy phòng
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography fontWeight='bold'>Điều kiện hủy phòng miễn phí là gì?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Để hủy miễn phí, bạn cần phải hủy trước ngày quy định trong đơn đặt phòng. Sau thời gian này, bạn
                      sẽ bị tính phí hủy phòng.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'
                  >
                    <Typography fontWeight='bold'>
                      Phí hủy phòng là bao nhiêu nếu hủy sau thời gian miễn phí?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Phí hủy phòng sẽ được tính dựa trên phần trăm giá trị đơn đặt phòng và sẽ được thông báo rõ trong
                      điều khoản.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls='panel3a-content'
                    id='panel3a-header'
                  >
                    <Typography fontWeight='bold'>Làm thế nào để liên hệ hỗ trợ nếu cần?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Bạn có thể sử dụng nút "Tin nhắn mới" bên dưới để liên hệ hệ thống hỗ trợ hoặc gọi đến số hotline
                      để được giải đáp thắc mắc.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls='panel4a-content'
                    id='panel4a-header'
                  >
                    <Typography fontWeight='bold'>
                      Sau khi hủy phòng, tôi có thể đặt lại cùng phòng đó không?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Sau khi hủy, phòng sẽ trở lại trạng thái có sẵn. Bạn có thể đặt lại phòng nếu phòng đó chưa được
                      người khác đặt.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls='panel5a-content'
                    id='panel5a-header'
                  >
                    <Typography fontWeight='bold'>Tôi có thể thay đổi ngày đặt phòng mà không hủy không?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Có thể! Bạn vui lòng liên hệ bộ phận hỗ trợ hoặc xem mục “Quản lý đặt phòng” để thực hiện thay đổi
                      mà không cần hủy. Việc thay đổi tùy thuộc vào tình trạng trống của phòng.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls='panel6a-content'
                    id='panel6a-header'
                  >
                    <Typography fontWeight='bold'>Khi nào tôi sẽ nhận được hoàn tiền sau khi hủy?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Sau khi hủy phòng thành công, số tiền sẽ được hoàn lại trong vòng 5-7 ngày làm việc, tùy thuộc vào
                      phương thức thanh toán mà bạn đã chọn.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ paddingRight: '12px', mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Box
                sx={{
                  bgcolor: 'white',
                  padding: '20px',
                  borderRadius: 2,
                  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ paddingTop: '24px' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                      <TextField
                        id='outlined-required'
                        label='Tên'
                        defaultValue='Huỳnh Nguyên'
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                      <TextField
                        id='outlined-required'
                        label='Số điện thoại'
                        defaultValue='09xxxxxxxx'
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                      <TextField
                        id='outlined-required'
                        label='Email'
                        defaultValue='nguyen@gmail.com'
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: 'white',
                  padding: '20px',
                  borderRadius: 2,
                  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
                  Miễn phí hủy đặt phòng
                </Typography>
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '1rem' }}>
                      <Box>
                        Để hủy miễn phí, bạn cần phải hủy <b>trước</b> ngày 17 Tháng 11 23:59 giờ. Sau thời gian này,
                        bạn sẽ không thể hủy được nữa.
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700', paddingTop: '1rem' }}>
                  Có thắc mắc ?
                </Typography>
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '1rem' }}>
                      <Box>Liên hệ hệ thống hỗ trợ nếu bạn có thắc mắc hay yêu cầu đặc biệt nào</Box>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ width: '100%', padding: '20px' }}>
                  <Button
                    startIcon={<ModeCommentIcon />}
                    fullWidth
                    sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
                  >
                    Tin nhắn mới
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fade>
  )
}
